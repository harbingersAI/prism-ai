import api from './Api';

export const createChatSession = async (): Promise<string> => {
  try {
    const response = await api.post<{ chatUuid: string }>('/api/chat/create-chat');
    return response.data.chatUuid;
  } catch (error) {
    console.error('Failed to create chat session:', error);
    throw error;
  }
};

export const validateChatSession = async (sessionId: string): Promise<boolean> => {
  try {
    const response = await api.post<{ status: string }>('/api/chat/validate-chat', { chatUuid: sessionId });
    return response.data.status === 'ok';
  } catch (error) {
    console.error('Failed to validate chat session:', error);
    return false;
  }
};