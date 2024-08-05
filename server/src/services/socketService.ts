import { Server as SocketIOServer, Socket } from 'socket.io';
import { verifyToken } from '../services/jwt';
import { authService } from '../services/auth';
import { chatService } from './chatService';
import PsychService from './psychService';
import SummaryService from './summaryService';
import logger from '../config/logger';

export class SocketService {
  private io: SocketIOServer;

  constructor(io: SocketIOServer) {
    this.io = io;
    this.setupEventHandlers();
    SummaryService.initialize(io);
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: Socket) => {
      logger.info(`New socket connection: ${socket.id}`);

      this.handleJoinRoom(socket);
      this.handleChatMessage(socket);
      this.handleGetChatHistory(socket);
      this.handleUpdateSessionInfo(socket);
      this.handleStartSummaryProcess(socket);
      this.handleDisconnect(socket);
    });
  }
  private handleJoinRoom(socket: Socket) {
    socket.on('join_room', (roomId: string) => {
      socket.join(roomId);
      logger.info(`Socket ${socket.id} joined room ${roomId}`);
    });
  }

  private handleChatMessage(socket: Socket) {
    socket.on('chat_message', async (message: any) => {
      const roomId = socket.data.uuid;
      const user = socket.data.user;
      
      if (!user || !roomId) {
        socket.emit('error', { message: 'User not authenticated or room not joined' });
        return;
      }

      // Get session info for end time
      const sessionInfo = await chatService.getSessionInfo(user.user_id, roomId);
      if (!sessionInfo || !sessionInfo.session_end) {
        socket.emit('error', { message: 'Failed to retrieve session information' });
        return;
      }

      const currentTime = new Date().getTime();
      const sessionEndTime = new Date(sessionInfo.session_end).getTime();

      // Check if the session time is expired
      if (sessionEndTime <= currentTime) {
        socket.emit('error', { message: 'Session time has expired. No new messages can be sent.' });
        return;
      }

      const chatMessage = {
        role: 'user',
        content: message.text,
        timestamp: new Date().toISOString(),
      };

      try {
        // Add user message to chat history
        const success = await chatService.addMessageToChatHistory(
          user.user_id,
          roomId,
          chatMessage
        );

        if (success) {
       

          // Get updated chat history
          const chatHistory = await chatService.getChatHistory(user.user_id, roomId);

          if (!chatHistory) {
            throw new Error('Failed to retrieve chat history');
          }

          // Process chat with AI
          const aiResponse = await PsychService.processChat(
            user.user_id,
            roomId,
            chatHistory,
            sessionEndTime
          );

          // Add AI response to chat history
          const aiMessage = {
            role: 'assistant',
            content: aiResponse.content,
            timestamp: new Date().toISOString(),
          };

          await chatService.addMessageToChatHistory(
            user.user_id,
            roomId,
            aiMessage
          );

          // Emit AI response to room
          this.io.to(roomId).emit('chat_message', {
            userId: 'AI',
            username: 'AI Assistant',
            message: aiMessage,
          });

          // Update session info
          const updatedSessionInfo = await chatService.getSessionInfo(user.user_id, roomId);
          if (updatedSessionInfo) {
            socket.emit('session_info_update', updatedSessionInfo);
          }

          logger.info(`AI response sent to room ${roomId}: ${JSON.stringify(aiMessage)}`);
        } else {
          socket.emit('error', { message: 'Failed to save chat message' });
        }
      } catch (error) {
        logger.error('Error handling chat message:', error);
        socket.emit('error', { message: 'An error occurred while processing your message' });
      }
    });
  }

  private handleGetChatHistory(socket: Socket) {
    socket.on('get_chat_history', async () => {
      const user = socket.data.user;
      const roomId = socket.data.uuid;

      if (!user || !roomId) {
        socket.emit('error', { message: 'User not authenticated or room not joined' });
        return;
      }

      try {
        const history = await chatService.getChatHistory(user.user_id, roomId);
        if (history) {
          socket.emit('chat_history', history);
        } else {
          socket.emit('error', { message: 'Failed to retrieve chat history' });
        }
      } catch (error) {
        logger.error('Error retrieving chat history:', error);
        socket.emit('error', { message: 'An error occurred while retrieving chat history' });
      }
    });
  }

  private handleUpdateSessionInfo(socket: Socket) {
    socket.on('update_session_info', async (data: { summary?: string, analysis?: string, scores?: Record<string, number> }) => {
      const user = socket.data.user;
      const roomId = socket.data.uuid;

      if (!user || !roomId) {
        socket.emit('error', { message: 'User not authenticated or room not joined' });
        return;
      }

      try {
        let updated = false;

        if (data.summary && data.analysis) {
          updated = await chatService.updateSessionSummaryAndAnalysis(
            user.user_id,
            roomId,
            data.summary,
            data.analysis
          );
        }

        if (data.scores) {
          const scoresUpdated = await chatService.updateSessionScores(
            user.user_id,
            roomId,
            data.scores
          );
          updated = updated || scoresUpdated;
        }

        if (updated) {
          const sessionInfo = await chatService.getSessionInfo(user.user_id, roomId);
          if (sessionInfo) {
            socket.emit('session_info_update', sessionInfo);
          }
        } else {
          socket.emit('error', { message: 'Failed to update session information' });
        }
      } catch (error) {
        logger.error('Error updating session info:', error);
        socket.emit('error', { message: 'An error occurred while updating session information' });
      }
    });
  }

  private handleStartSummaryProcess(socket: Socket) {
    socket.on('start_summary_process', async (data: { chatUuid: string }) => {
      const user = socket.data.user;
      if (!user || !data.chatUuid) {
        socket.emit('error', { message: 'User not authenticated or chat UUID not provided' });
        return;
      }

      try {
        await SummaryService.startSummaryProcess(user.user_id, data.chatUuid);
        socket.emit('summary_process_started', { message: 'Summary process started successfully' });
      } catch (error) {
        logger.error('Error starting summary process:', error);
        socket.emit('error', { message: 'Failed to start summary process' });
      }
    });
  }

  private handleDisconnect(socket: Socket) {
    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  }
}
