export interface ChatSession {
    id: string;
    session_uuid: string;
    user_id: string;
    session_start: string;
    session_end: string;
    session_chat_history: any[]; // Consider creating a more specific type for chat messages
    session_summary: string | null;
    session_analysis: string | null;
    session_scores: any | null; // Consider creating a more specific type for scores
    created_at: string;
    updated_at: string;
  }


  export interface ChatMessage {
    role: string;
    content: string;
    timestamp: string;
  }