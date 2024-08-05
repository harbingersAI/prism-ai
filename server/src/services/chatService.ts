import { v4 as uuidv4 } from 'uuid';
import { supabaseAdmin } from '../config/supabase';
import { IUserProfile } from '../types/auth';
import logger from '../config/logger';

interface ChatMessage {
  role: string;
  content: string;
  timestamp: string;
}

interface ChatSession {
  session_uuid: string;
  user_id: string;
  session_start: string;
  session_end: string;
  session_chat_history: ChatMessage[];
  session_summary: string | null;
  session_analysis: string | null;
  session_scores: Record<string, number> | null;
  ended: boolean;
  summary_started: boolean;
  summarized: boolean;
}

class ChatService {
  private async verifyUserAccess(userId: string, sessionUuid: string): Promise<boolean> {
    try {
      const { data, error } = await supabaseAdmin
        .from('chat_sessions')
        .select('user_id')
        .eq('session_uuid', sessionUuid)
        .single();

      if (error) throw error;
      return data.user_id === userId;
    } catch (error) {
      logger.error('Error verifying user access:', error);
      return false;
    }
  }

  async createChatSession(user: IUserProfile): Promise<string | null> {
    try {
      const sessionUuid = uuidv4();
      const { data, error } = await supabaseAdmin
        .from('chat_sessions')
        .insert({
          session_uuid: sessionUuid,
          user_id: user.user_id,
          ended: false,
          summary_started: false,
          summarized: false,
        })
        .single();

      if (error) throw error;
      logger.info(`Chat session created: ${sessionUuid}`);
      return sessionUuid;
    } catch (error) {
      logger.error('Error creating chat session:', error);
      return null;
    }
  }

  async addMessageToChatHistory(userId: string, sessionUuid: string, message: ChatMessage): Promise<boolean> {
    try {
      if (!await this.verifyUserAccess(userId, sessionUuid)) {
        throw new Error('User does not have access to this chat session');
      }

      const { data, error } = await supabaseAdmin
        .rpc('add_chat_message', {
          p_session_uuid: sessionUuid,
          p_user_id: userId,
          p_message: message
        });

      if (error) throw error;
      logger.info(`Message added to chat session: ${sessionUuid}`);
      return true;
    } catch (error) {
      logger.error('Error adding message to chat history:', error);
      return false;
    }
  }

  async getChatHistory(userId: string, sessionUuid: string): Promise<ChatMessage[] | null> {
    try {
      if (!await this.verifyUserAccess(userId, sessionUuid)) {
        throw new Error('User does not have access to this chat session');
      }

      const { data, error } = await supabaseAdmin
        .from('chat_sessions')
        .select('session_chat_history')
        .eq('session_uuid', sessionUuid)
        .single();

      if (error) throw error;
      return data.session_chat_history;
    } catch (error) {
      logger.error('Error retrieving chat history:', error);
      return null;
    }
  }

  async updateSessionSummaryAndAnalysis(userId: string, sessionUuid: string, summary: string, analysis: string): Promise<boolean> {
    try {
      if (!await this.verifyUserAccess(userId, sessionUuid)) {
        throw new Error('User does not have access to this chat session');
      }

      const { data, error } = await supabaseAdmin
        .from('chat_sessions')
        .update({ session_summary: summary, session_analysis: analysis })
        .eq('session_uuid', sessionUuid);

      if (error) throw error;
      logger.info(`Updated summary and analysis for session: ${sessionUuid}`);
      return true;
    } catch (error) {
      logger.error('Error updating session summary and analysis:', error);
      return false;
    }
  }

  async updateSessionScores(userId: string, sessionUuid: string, scores: Record<string, number>): Promise<boolean> {
    try {
      if (!await this.verifyUserAccess(userId, sessionUuid)) {
        throw new Error('User does not have access to this chat session');
      }

      const { data, error } = await supabaseAdmin
        .from('chat_sessions')
        .update({ session_scores: scores })
        .eq('session_uuid', sessionUuid);

      if (error) throw error;
      logger.info(`Updated scores for session: ${sessionUuid}`);
      return true;
    } catch (error) {
      logger.error('Error updating session scores:', error);
      return false;
    }
  }

  async getSessionInfo(userId: string, sessionUuid: string): Promise<Partial<ChatSession> | null> {
    try {
      if (!await this.verifyUserAccess(userId, sessionUuid)) {
        throw new Error('User does not have access to this chat session');
      }

      const { data, error } = await supabaseAdmin
        .from('chat_sessions')
        .select('session_start, session_end, ended, summary_started, summarized')
        .eq('session_uuid', sessionUuid)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error retrieving session info:', error);
      return null;
    }
  }

  async getSessionSummary(userId: string, sessionUuid: string): Promise<Partial<ChatSession> | null> {
    try {
      if (!await this.verifyUserAccess(userId, sessionUuid)) {
        throw new Error('User does not have access to this chat session');
      }

      const { data, error } = await supabaseAdmin
        .from('chat_sessions')
        .select('session_summary, session_analysis, session_scores')
        .eq('session_uuid', sessionUuid)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error retrieving session summary:', error);
      return null;
    }
  }

  async deleteChatSession(userId: string, sessionUuid: string): Promise<boolean> {
    try {
      if (!await this.verifyUserAccess(userId, sessionUuid)) {
        throw new Error('User does not have access to this chat session');
      }

      const { data, error } = await supabaseAdmin
        .from('chat_sessions')
        .delete()
        .eq('session_uuid', sessionUuid);

      if (error) throw error;
      logger.info(`Deleted chat session: ${sessionUuid}`);
      return true;
    } catch (error) {
      logger.error('Error deleting chat session:', error);
      return false;
    }
  }

  async updateSessionSummary(userId: string, chatUuid: string, summary: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('chat_sessions')
      .update({ session_summary: summary })
      .match({ user_id: userId, session_uuid: chatUuid });

    if (error) throw error;
  }

  async updateSessionAnalysis(userId: string, chatUuid: string, analysis: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('chat_sessions')
      .update({ session_analysis: analysis })
      .match({ user_id: userId, session_uuid: chatUuid });

    if (error) throw error;
  }

  async hasSessionEnded(sessionUuid: string): Promise<boolean> {
    try {
      const { data, error } = await supabaseAdmin
        .from('chat_sessions')
        .select('ended')
        .eq('session_uuid', sessionUuid)
        .single();

      if (error) throw error;
      return data?.ended || false;
    } catch (error) {
      logger.error('Error checking if session has ended:', error);
      return false;
    }
  }

  async hasSummaryStarted(sessionUuid: string): Promise<boolean> {
    try {
      const { data, error } = await supabaseAdmin
        .from('chat_sessions')
        .select('summary_started')
        .eq('session_uuid', sessionUuid)
        .single();

      if (error) throw error;
      return data?.summary_started || false;
    } catch (error) {
      logger.error('Error checking if summary has started:', error);
      return false;
    }
  }

  async hasSummaryEnded(sessionUuid: string): Promise<boolean> {
    try {
      const { data, error } = await supabaseAdmin
        .from('chat_sessions')
        .select('summarized')
        .eq('session_uuid', sessionUuid)
        .single();

      if (error) throw error;
      return data?.summarized || false;
    } catch (error) {
      logger.error('Error checking if summary has ended:', error);
      return false;
    }
  }

  async updateSessionStatus(sessionUuid: string, status: 'ended' | 'summary_started' | 'summarized', value: boolean): Promise<void> {
    try {
      const updateData = { [status]: value };

      const { error } = await supabaseAdmin
        .from('chat_sessions')
        .update(updateData)
        .eq('session_uuid', sessionUuid);

      if (error) throw error;
      logger.info(`Updated ${status} status to ${value} for session: ${sessionUuid}`);
    } catch (error) {
      logger.error(`Error updating ${status} status:`, error);
      throw error;
    }
  }

  async getSessionStatus(sessionUuid: string): Promise<{
    ended: boolean;
    summary_started: boolean;
    summarized: boolean;
  }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('chat_sessions')
        .select('ended, summary_started, summarized')
        .eq('session_uuid', sessionUuid)
        .single();

      if (error) throw error;

      return {
        ended: data?.ended || false,
        summary_started: data?.summary_started || false,
        summarized: data?.summarized || false,
      };
    } catch (error) {
      logger.error('Error getting session status:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();