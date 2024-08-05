// src/services/SummaryService.ts

import { supabaseClient } from '../config/supabase';
import { generateAI71Response } from './ai71';
import { getPromptById } from '../data/prompts';
import PsychProfileService from './psychProfileService';
import { chatService } from './chatService';
import { AI71Request, AI71Message } from '../types/ai71';
import { ChatSession, ChatMessage } from '../types/chat';
import { PsychometricProfile } from '../types/psych';
import logger from '../config/logger';
import { Server as SocketIOServer } from 'socket.io';

class SummaryService {
  private static MAX_RETRIES = 5;
  private static io: SocketIOServer;

  static initialize(socketIo: SocketIOServer) {
    this.io = socketIo;
  }

  static async startSummaryProcess(userId: string, chatUuid: string): Promise<void> {
    try {
      // Check if summary has already started
      const summaryStarted = await chatService.hasSummaryStarted(chatUuid);
      if (summaryStarted) {
        logger.info(`Summary process already started for chat ${chatUuid}`);
        return;
      }

      // Mark summary as started
      await chatService.updateSessionStatus(chatUuid, 'summary_started', true);
      logger.info(`SUMMARY STARTING`);

      const chatHistory = await chatService.getChatHistory(userId, chatUuid);
      if (!chatHistory) {
        throw new Error('Chat history not found');
      }

      const parsedChat = this.parseChat(chatHistory);
      const stringifiedChat = this.stringifyChat(parsedChat);

      await this.updatePsychProfile(userId, stringifiedChat);
      await this.generateSessionSummary(userId, chatUuid, stringifiedChat);
      await this.generateSessionAnalysis(userId, chatUuid, stringifiedChat);
      await this.generateSessionScores(userId, chatUuid, stringifiedChat);

      // Mark summary as completed
      await chatService.updateSessionStatus(chatUuid, 'summarized', true);
      this.emitToRoom(chatUuid, 'summary_complete', { message: 'Full summary process completed' });
    } catch (error) {
      logger.error('Error in summary process:', error);
      this.emitToRoom(chatUuid, 'summary_error', { message: 'Error occurred during summary process' });
      // Reset summary started status in case of error
      await chatService.updateSessionStatus(chatUuid, 'summary_started', false);
    }
  }

  private static parseChat(chatHistory: ChatMessage[]): { role: string; content: string }[] {
    return chatHistory
      .filter(message => !message.content.includes('We have only a few minutes left') && !message.content.includes('Our session is about to end'))
      .map(message => ({
        role: message.role === 'assistant' ? 'Psychologist' : 'Patient',
        content: message.content,
      }));
  }

  private static stringifyChat(parsedChat: { role: string; content: string }[]): string {
    return parsedChat.map(message => `{role: "${message.role}", content: "${message.content.replace(/"/g, '\\"')}"}`).join('');
  }

  private static async updatePsychProfile(userId: string, stringifiedChat: string): Promise<void> {
    const currentProfile = await PsychProfileService.getProfile(userId);
    if (!currentProfile) {
      throw new Error('User profile not found');
    }

    // Move current profile to previous
    await PsychProfileService.updateProfile(userId, {
      psych_profile_prev_json: currentProfile.psych_profile_json,
      psych_profile_prev_summary: currentProfile.psych_profile_summary,
    });

    // Generate new summary
    const newSummary = await this.generateAI71Response(8, stringifiedChat);
    await PsychProfileService.updateProfile(userId, { psych_profile_summary: newSummary });

    // Generate new profile JSON
    const newProfileJson = await this.generateJsonResponse(9, stringifiedChat);
    await PsychProfileService.updateProfile(userId, { psych_profile_json: newProfileJson });

    this.emitToUser(userId, 'profile_summary_complete', { message: 'Profile summary updated' });
  }

  private static async generateSessionSummary(userId: string, chatUuid: string, stringifiedChat: string): Promise<void> {
    const summary = await this.generateAI71Response(10, stringifiedChat);
    await chatService.updateSessionSummary(userId, chatUuid, summary);
    this.emitToRoom(chatUuid, 'session_summary_complete', { message: 'Session summary generated' });
  }

  private static async generateSessionAnalysis(userId: string, chatUuid: string, stringifiedChat: string): Promise<void> {
    const currentProfile = await PsychProfileService.getProfile(userId);
    if (!currentProfile) {
      throw new Error('User profile not found');
    }

    const prompt = `PROVIDED CHAT: ${stringifiedChat}, PROVIDED CURRENT PROFILE: ${currentProfile.psych_profile_summary}, PROVIDED PREVIOUS PROFILE: ${currentProfile.psych_profile_prev_summary}. PROVIDE THE ANALYSIS.`;
    const analysis = await this.generateAI71Response(11, prompt);
    await chatService.updateSessionAnalysis(userId, chatUuid, analysis);
  }

  private static async generateSessionScores(userId: string, chatUuid: string, stringifiedChat: string): Promise<void> {
    const sessionInfo = await chatService.getSessionInfo(userId, chatUuid);
    if (!sessionInfo) {
      throw new Error('Session info not found');
    }

    const prompt = `PROVIDED CHAT: ${stringifiedChat}, PROVIDED SESSION SUMMARY: ${sessionInfo.session_summary}, PROVIDED SESSION ANALYSIS: ${sessionInfo.session_analysis}. PROVIDE THE FULL JSON. ONLY JSON FORMAT ACCEPTED AS ASSISTANT RESPONSE. JSON PER THE SYSTEM MESSAGE REQUIREMENTS.`;
    const scores = await this.generateJsonResponse(12, prompt);
    await chatService.updateSessionScores(userId, chatUuid, scores);

    this.emitToRoom(chatUuid, 'session_scores_complete', {
      message: 'Session scores generated',
      summary: sessionInfo.session_summary,
      analysis: sessionInfo.session_analysis,
      scores,
    });
  }

  private static async generateAI71Response(promptId: number, userContent: string): Promise<string> {
    const systemPrompt = getPromptById(promptId)?.content || '';
    const ai71Request: AI71Request = {
      model: 'tiiuae/falcon-180b-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
    };

    const response = await generateAI71Response(ai71Request);
    return response.choices[0].message.content;
  }

  private static async generateJsonResponse(promptId: number, userContent: string, retries = 0): Promise<any> {
    if (retries >= this.MAX_RETRIES) {
      return { error: 'Failed to generate valid JSON response after multiple attempts' };
    }
  
    try {
      const response = await this.generateAI71Response(promptId, userContent);
      const cleanedResponse = this.cleanJsonString(response);
      return JSON.parse(cleanedResponse);
    } catch (error) {
      logger.warn(`Failed to parse JSON response, attempt ${retries + 1}/${this.MAX_RETRIES}`);
      return this.generateJsonResponse(promptId, userContent, retries + 1);
    }
  }

  private static cleanJsonString(jsonString: string): string {
    const jsonStart = jsonString.indexOf('{');
    const jsonEnd = jsonString.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      jsonString = jsonString.substring(jsonStart, jsonEnd + 1);
    } else {
      throw new Error('Invalid JSON structure');
    }
  
    return jsonString
      .replace(/\\n/g, '')
      .replace(/\\"/g, '"')
      .replace(/\\t/g, '')
      .replace(/\\r/g, '')
      .trim();
  }

  static async getLatestPsychProfile(userId: string): Promise<PsychometricProfile | null> {
    return PsychProfileService.getProfile(userId);
  }

  static async getLatestSessionInfo(userId: string, chatUuid: string): Promise<Partial<ChatSession> | null> {
    const sessionInfo = await chatService.getSessionSummary(userId, chatUuid);
    if (!sessionInfo) return null;
    return {
      session_summary: sessionInfo.session_summary,
      session_analysis: sessionInfo.session_analysis,
      session_scores: sessionInfo.session_scores,
    };
  }

  static async getSessionStatus(chatUuid: string): Promise<{ ended: boolean; summary_started: boolean; summarized: boolean }> {
    return chatService.getSessionStatus(chatUuid);
  }

  static async updateSessionStatus(chatUuid: string, status: 'ended' | 'summary_started' | 'summarized', value: boolean): Promise<void> {
    await chatService.updateSessionStatus(chatUuid, status, value);
  }

  static async endSession(chatUuid: string): Promise<void> {
    await chatService.updateSessionStatus(chatUuid, 'ended', true);
    this.emitToRoom(chatUuid, 'session_ended', { message: 'Chat session has ended' });
  }

  private static emitToRoom(roomId: string, event: string, data: any): void {
    if (this.io) {
      this.io.to(roomId).emit(event, data);
    } else {
      logger.warn('Socket.IO not initialized. Unable to emit event:', event);
    }
  }

  private static emitToUser(userId: string, event: string, data: any): void {
    if (this.io) {
      this.io.to(userId).emit(event, data);
    } else {
      logger.warn('Socket.IO not initialized. Unable to emit event:', event);
    }
  }
}

export default SummaryService;