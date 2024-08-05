// src/services/PsychService.ts

import { supabaseClient } from '../config/supabase';
import { getPromptById } from '../data/prompts';
import { generateAI71Response } from './ai71';
import PsychProfileService from './psychProfileService';
import { AI71Request, AI71Message } from '../types/ai71';
import { PsychometricProfile } from '../types/psych';
import { ChatSession } from '../types/chat';
import { authService } from './auth'; // Import authService to fetch user details

interface ParsedChat {
  role: "user" | "system" | "assistant";
  content: string;
}

class PsychService {
  private static chatParse(chatHistory: ChatSession['session_chat_history']): AI71Message[] {
    return chatHistory.map(message => ({
      role: message.role as "user" | "assistant",
      content: message.content
    }));
  }

  private static chatAdd(chat: AI71Message[], promptId: number): AI71Message[] {
    const addedPrompt = getPromptById(promptId)?.content || '';
    return chat.map(message => 
      message.role === 'user' 
        ? { ...message, content: `${message.content}\n\n${addedPrompt}` }
        : message
    );
  }

  private static chatTime(chat: AI71Message[], promptId: number): AI71Message[] {
    const timePrompt = getPromptById(promptId)?.content || '';
    const lastUserIndex = chat.map(m => m.role).lastIndexOf('user');
    if (lastUserIndex !== -1) {
      chat[lastUserIndex] = {
        ...chat[lastUserIndex],
        content: `${chat[lastUserIndex].content}\n\n${timePrompt}`
      };
    }
    return chat;
  }

  static async processChat(
    userId: string,
    chatId: string,
    chatHistory: ChatSession['session_chat_history'],
    sessionEndTime: number
  ): Promise<AI71Message> {    console.log(userId)
    // Fetch user profile and session info
    const userProfile = await PsychProfileService.getProfile(userId);
    const sessionInfo = await this.getSessionInfo(chatId);
    const userDetails = await authService.getUserProfile(userId);


    if (!userProfile || !sessionInfo || !userDetails) {
      throw new Error('Unable to fetch user profile, session info, or user details');
    }
    const userFullName = userDetails?.full_name ?? 'Unknown User';

    const psychSummary = await this.createPsychSummary(userProfile, userFullName);
    let parsedChat = this.chatParse(chatHistory);
    parsedChat = this.chatAdd(parsedChat, 3);

    const currentTime = Date.now();
    const timeLeft = sessionEndTime - currentTime;

    if (timeLeft < 120000 && timeLeft > 30000) { // 2 minutes to 30 seconds left
      parsedChat = this.chatTime(parsedChat, 4);
    } else if (timeLeft <= 30000 || timeLeft < 0) { // Less than 30 seconds or session ended
      parsedChat = this.chatTime(parsedChat, 5);
    }

    const systemPrompt = this.createSystemPrompt(psychSummary);
    const finalChat: AI71Message[] = [
      { role: 'system', content: systemPrompt },
      ...parsedChat
    ];

    const ai71Response = await this.callAI71API(finalChat);
    return this.processAI71Response(ai71Response);
  }

  private static async createPsychSummary(userProfile: PsychometricProfile, fullName: string): Promise<string> {
    const psychProfileSummary = await PsychProfileService.getPsychProfileSummary(userProfile.user_id);
    
    if (psychProfileSummary && psychProfileSummary.length > 0) {
      return `userPsych.txt===\nThe user's name is: ${fullName}\nTheir psychSummary is as follows:\n${psychProfileSummary}`;
    } else {
      return `userPsych.txt===\nThe user's name is: ${fullName}\nThis is their first session, so we don't have any additional information about them.`;
    }
  }

  private static createSystemPrompt(psychSummary: string): string {
    const mainPrompt = getPromptById(1)?.content || '';
    return `${mainPrompt}\n\n${psychSummary}\n\nProceed with the session.`;
  }

  private static async callAI71API(chat: AI71Message[]): Promise<any> {
    const ai71Request: AI71Request = {
      model: 'tiiuae/falcon-180b-chat',
      messages: chat,
    };

    try {
      const response = await generateAI71Response(ai71Request);
      return response;
    } catch (error) {
      console.error('Error calling AI71 API:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  private static processAI71Response(response: any): AI71Message {
    if (response && response.choices && response.choices.length > 0) {
      const message = response.choices[0].message;
      return {
        role: message.role as "assistant",
        content: message.content,
      };
    }
    throw new Error('Invalid AI71 API response');
  }

  private static async getSessionInfo(chatId: string): Promise<ChatSession | null> {
    const { data, error } = await supabaseClient
      .from('chat_sessions')
      .select('*')
      .eq('session_uuid', chatId)
      .single();

    if (error) {
      console.error('Error fetching session info:', error);
      return null;
    }

    return data;
  }
}

export default PsychService;