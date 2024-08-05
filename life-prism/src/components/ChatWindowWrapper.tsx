import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import api from '@/utils/Api';
import ChatWindow from '@/components/Session/ChatWindow';
import SessionSummary from '@/components/Session/SessionSummary';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/styles/components/Session/ChatWindowWrapper.module.scss';
import { validateChatSession } from '@/utils/chatUtils';
import Button from '@/components/Reusable/Button';
import Skeleton from '@/components/Reusable/Skeleton';

interface SessionInfo {
  session_uuid: string;
  session_start: string;
  session_end: string;
  // Add other session info fields as needed
}

const ChatWindowWrapper: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const sessionId = router.query.session_id as string;
  console.log(sessionId);

  const validateSession = useCallback(async (sid: string) => {
    try {
      const isValid = await validateChatSession(sid);
      if (!isValid) {
        router.replace('/chat');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Failed to validate session:', error);
      router.replace('/chat');
      return false;
    }
  }, [router]);

  const fetchSessionInfo = useCallback(async (sid: string) => {
    try {
      const response = await api.getChatSessionInfo(sid);
      setSessionInfo(response.data);

      const currentTime = new Date().getTime();
      const sessionEndTime = new Date(response.data.session_end).getTime();
      
      if (currentTime >= sessionEndTime) {
        await handleSessionEnd(sid);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeSession = async () => {
      if (sessionId) {
        setIsLoading(true);
        const isValid = await validateSession(sessionId);
        if (isValid) {
          await fetchSessionInfo(sessionId);
        }
      } else {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, [sessionId, validateSession, fetchSessionInfo]);

  const handleSessionEnd = async (sid: string) => {
    try {
      await api.startSummaryProcess(sid);
      setShowSummary(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start summary process');
    }
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    if (sessionId) {
      fetchSessionInfo(sessionId);
    } else {
      router.replace('/chat');
    }
  };

  if (isLoading) {
    return (
      <motion.div 
        className={styles.loadingContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Skeleton />
        <p>Loading session information...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className={styles.errorContainer}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <h2>Error</h2>
        <p>{error}</p>
        <Button onClick={handleRetry} variant="secondary">Retry</Button>
      </motion.div>
    );
  }

  if (!sessionInfo) {
    return (
      <motion.div 
        className={styles.errorContainer}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <h2>Session Information Unavailable</h2>
        <p>Unable to retrieve chat session info. Please try again later.</p>
        <Button onClick={handleRetry} variant="secondary">Retry</Button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {showSummary ? (
        <motion.div
          key="summary"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <SessionSummary
            sessionId={sessionId}
            startTime={sessionInfo.session_start}
          />
        </motion.div>
      ) : (
        <motion.div
          key="chat"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <ChatWindow 
            sessionId={sessionId} 
            sessionerInfo={sessionInfo} 
            onSessionEnd={() => handleSessionEnd(sessionId)} 
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWindowWrapper;
