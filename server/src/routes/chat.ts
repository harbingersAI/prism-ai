import express from 'express';
import { authenticateJwt } from '../middleware/jwtAuth';
import { chatService } from '../services/chatService';
import SummaryService from '../services/summaryService';
import logger from '../config/logger';
import { supabaseAdmin } from '../config/supabase';

const router = express.Router();

router.post('/create-chat', authenticateJwt, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    const sessionUuid = await chatService.createChatSession(req.user);
    
    if (sessionUuid) {
        res.json({ chatUuid: sessionUuid });
    } else {
        res.status(500).json({ error: 'Failed to create chat session' });
    }
});

router.post('/validate-chat', authenticateJwt, (req, res) => {
    const { chatUuid } = req.body;

    if (chatUuid) {
        res.json({ status: 'ok' });
    } else {
        res.status(400).json({ error: 'Invalid chat UUID' });
    }
});

router.get('/chat-session-info/:chatUuid', authenticateJwt, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    const { chatUuid } = req.params;

    try {
        const sessionInfo = await chatService.getSessionInfo(req.user.user_id, chatUuid);
        if (!sessionInfo) {
            return res.status(404).json({ error: 'Chat session not found' });
        }

        res.json(sessionInfo);
    } catch (error) {
        logger.error('Error in get-chat-session-info:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/start-summary', authenticateJwt, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    const { chatUuid } = req.body;

    if (!chatUuid) {
        return res.status(400).json({ error: 'Chat UUID is required' });
    }

    try {
        const summaryStarted = await chatService.hasSummaryStarted(chatUuid);

        if (summaryStarted) {
            return res.status(200).json({ message: 'Summary process has already started' });
        }

        // Start the summary process asynchronously
        SummaryService.startSummaryProcess(req.user.user_id, chatUuid).catch(error => {
            logger.error('Error in summary process:', error);
        });

        res.status(200).json({ message: 'Summary process started successfully' });
    } catch (error) {
        logger.error('Error starting summary process:', error);
        res.status(500).json({ error: 'Failed to start summary process' });
    }
});

router.get('/latest-psych-profile', authenticateJwt, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        const profile = await SummaryService.getLatestPsychProfile(req.user.user_id);
        if (!profile) {
            return res.status(404).json({ error: 'Psychometric profile not found' });
        }
        res.json(profile);
    } catch (error) {
        logger.error('Error fetching latest psych profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/latest-session-info/:chatUuid', authenticateJwt, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    const { chatUuid } = req.params;

    try {
        const sessionInfo = await SummaryService.getLatestSessionInfo(req.user.user_id, chatUuid);
        if (!sessionInfo) {
            return res.status(404).json({ error: 'Session information not found' });
        }
        res.json(sessionInfo);
    } catch (error) {
        logger.error('Error fetching latest session info:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/session-status/:chatUuid', authenticateJwt, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    const { chatUuid } = req.params;

    try {
        const status = await chatService.getSessionStatus(chatUuid);
        res.status(200).json(status);
    } catch (error) {
        logger.error('Error getting session status:', error);
        res.status(500).json({ error: 'Failed to get session status' });
    }
});

router.get('/user-sessions', authenticateJwt, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        const { data, error } = await supabaseAdmin
            .from('chat_sessions')
            .select('session_uuid, session_start, ended, summary_started, summarized')
            .eq('user_id', req.user.user_id)
            .order('session_start', { ascending: true });

        if (error) {
            logger.error('Error fetching user chat sessions:', error);
            return res.status(500).json({ error: 'Failed to fetch chat sessions' });
        }

        res.json({ sessions: data });
    } catch (error) {
        logger.error('Unexpected error in user-sessions route:', error);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
});

export default router;