// src/types/psych.ts

export interface CogniScore {
    "Career/Work": number;
    "Finance": number;
    "Health/Fitness": number;
    "Family": number;
    "Relationships": number;
    "Personal Growth": number;
    "Spirituality": number;
    "Recreation/Leisure": number;
  }
  
  export interface PsychometricProfile {
    id: string;
    user_id: string;
    psych_profile_json: Record<string, any>;
    psych_profile_prev_json: Record<string, any>;
    psych_profile_summary: string | null;
    psych_profile_prev_summary: string | null;
    cogni_score: CogniScore;
    patterns: any[];
    ai_notes: string | null;
    created_at: string;
    updated_at: string;
  }
  
  export interface UpdatePsychometricProfileData {
    psych_profile_json?: Record<string, any>;
    psych_profile_prev_json?: Record<string, any>;
    psych_profile_summary?: string | null;
    psych_profile_prev_summary?: string | null;
    cogni_score?: Partial<CogniScore>;
    patterns?: any[];
    ai_notes?: string | null;
  }