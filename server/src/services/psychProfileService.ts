// src/services/PsychProfileService.ts

import { supabaseAdmin } from '../config/supabase';
import { PsychometricProfile, UpdatePsychometricProfileData, CogniScore } from '../types/psych';

//Admin Access

class PsychProfileService {
  private static TABLE_NAME = 'psychometric_profiles';


  static async getProfile(userId: string): Promise<PsychometricProfile | null> {
    console.log(userId);
    console.log(this.TABLE_NAME);
    const { data, error } = await supabaseAdmin
      .from(this.TABLE_NAME)
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching psychometric profile:', error);
      throw error;
    }

    return data;
  }

  static async updateProfile(userId: string, updateData: UpdatePsychometricProfileData): Promise<PsychometricProfile | null> {
    const { data, error } = await supabaseAdmin
      .from(this.TABLE_NAME)
      .update(updateData)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error updating psychometric profile:', error);
      throw error;
    }

    return data;
  }

  static async getPsychProfileJson(userId: string): Promise<Record<string, any> | null> {
    const { data, error } = await supabaseAdmin
      .from(this.TABLE_NAME)
      .select('psych_profile_json')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching psych profile json:', error);
      throw error;
    }

    return data?.psych_profile_json || null;
  }

  static async getPsychProfilePrevJson(userId: string): Promise<Record<string, any> | null> {
    const { data, error } = await supabaseAdmin
      .from(this.TABLE_NAME)
      .select('psych_profile_prev_json')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching psych profile prev json:', error);
      throw error;
    }

    return data?.psych_profile_prev_json || null;
  }

  static async getPsychProfileSummary(userId: string): Promise<string | null> {
    const { data, error } = await supabaseAdmin
      .from(this.TABLE_NAME)
      .select('psych_profile_summary')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching psych profile summary:', error);
      throw error;
    }

    return data?.psych_profile_summary || null;
  }

  static async getPsychProfilePrevSummary(userId: string): Promise<string | null> {
    const { data, error } = await supabaseAdmin
      .from(this.TABLE_NAME)
      .select('psych_profile_prev_summary')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching psych profile prev summary:', error);
      throw error;
    }

    return data?.psych_profile_prev_summary || null;
  }

  static async getCogniScore(userId: string): Promise<CogniScore | null> {
    const { data, error } = await supabaseAdmin
      .from(this.TABLE_NAME)
      .select('cogni_score')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching cogni score:', error);
      throw error;
    }

    return data?.cogni_score || null;
  }

  static async getPatterns(userId: string): Promise<any[] | null> {
    const { data, error } = await supabaseAdmin
      .from(this.TABLE_NAME)
      .select('patterns')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching patterns:', error);
      throw error;
    }

    return data?.patterns || null;
  }

  static async getAiNotes(userId: string): Promise<string | null> {
    const { data, error } = await supabaseAdmin
      .from(this.TABLE_NAME)
      .select('ai_notes')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching AI notes:', error);
      throw error;
    }

    return data?.ai_notes || null;
  }
}

export default PsychProfileService;