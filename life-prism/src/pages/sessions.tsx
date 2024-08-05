import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { withAuth } from '../components/withAuth';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/Api';
import styles from '@/styles/pages/Sessions.module.scss';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout/Layout';
import { format, parseISO, compareDesc } from 'date-fns';

interface Session {
  session_uuid: string;
  session_start: string;
}

const SessionsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get<{ sessions: Session[] }>('/api/chat/user-sessions');
        if (Array.isArray(response.data.sessions)) {
          setSessions(response.data.sessions);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
        setError('Failed to load sessions. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "do 'of' MMMM, yyyy");
  };

  const groupSessionsByDate = (sessions: Session[]) => {
    if (!Array.isArray(sessions)) return [];
    
    const grouped = sessions.reduce((acc: { [key: string]: Session[] }, session) => {
      const date = session.session_start.split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(session);
      return acc;
    }, {});

    return Object.entries(grouped)
      .sort(([dateA], [dateB]) => compareDesc(parseISO(dateA), parseISO(dateB))) // Sort days descending
      .map(([date, sessions]) => ({
        date,
        sessions: sessions.map((session, index) => ({
          ...session,
          number: index + 1
        }))
      }));
  };

  const startNewSession = () => {
    router.push('/chat');
  };

  const groupedSessions = groupSessionsByDate(sessions);

  if (isLoading) {
    return (
      <Layout>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p>Loading sessions...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className={styles.errorContainer}>
          <p>{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.sessionsPage}>
        <h1 className={styles.pageTitle}>Your Chat Sessions</h1>
        
        <motion.div 
          className={styles.newSessionCard}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <h2>Start a New Session</h2>
          <p>Ready for a new conversation?</p>
          <button onClick={startNewSession} className={styles.newSessionButton}>
            Start New Chat
          </button>
        </motion.div>

        {sessions.length === 0 ? (
          <div className={styles.noSessions}>
            <p>You haven&apos;t had any chat sessions yet. Start your first one!</p>
          </div>
        ) : (
          groupedSessions.map(({ date, sessions }) => (
            <div key={date} className={styles.dateGroup}>
              <h2 className={styles.dateTitle}>{formatDate(date)}</h2>
              <div className={styles.sessionCards}>
                {sessions.map((session) => (
                  <motion.div
                    key={session.session_uuid}
                    className={styles.sessionCard}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(`/chat?session_id=${session.session_uuid}`)}
                  >
                    <h3 className={styles.sessionTitle}>Session #{session.number}</h3>
                    <p className={styles.sessionTime}>
                      {format(parseISO(session.session_start), 'h:mm a')}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default withAuth(SessionsPage);