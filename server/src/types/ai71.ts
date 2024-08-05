export interface AI71Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }
  
  export interface AI71Request {
    model: string;
    messages: AI71Message[];
  }
  
  export interface AI71Response {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
      index: number;
      message: AI71Message;
      finish_reason: string;
    }[];
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  }