import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { withAuth } from '../components/withAuth';
import { useAuth } from '../hooks/useAuth';
import { createChatSession } from '../utils/chatUtils';
import Button from '../components/Reusable/Button';
import styles from '@/styles/pages/Chat.module.scss';
import ChatWindowWrapper from '@/components/ChatWindowWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout/Layout';

const ChatPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  useEffect(() => {
    const createNewSessionIfNeeded = async () => {
      if (!router.query.session_id) {
        setIsCreatingSession(true);
        try {
          const newSessionId = await createChatSession();
          router.push(`/chat?session_id=${newSessionId}`, undefined, { shallow: true });
        } catch (error) {
          console.error('Failed to create new chat session:', error);
          // Implement error handling, e.g., show a toast notification
        } finally {
          setIsCreatingSession(false);
        }
      }
    };

    createNewSessionIfNeeded();
  }, [router]);

  if (isCreatingSession) {
    return (
      <Layout>
        <motion.div 
          className={styles.loadingContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <motion.div
            className={styles.loadingSpinner}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <p>Creating a new chat session...</p>
        </motion.div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div 
        className={styles.chatPage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ChatWindowWrapper />
      </motion.div>
    </Layout>
  );
};

export default withAuth(ChatPage);
