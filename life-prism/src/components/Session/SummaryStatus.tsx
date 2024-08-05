// SummaryStatus.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/utils/Api';
import styles from '@/styles/components/Session/SummaryStatus.module.scss';
import { useRouter } from 'next/router';

interface SummaryStatusProps {
  sessionId: string;
  onSummaryReady: any;
}

interface SessionStatus {
  sessionEnded: boolean;
  summaryStarted: boolean;
  summaryEnded: boolean;
}

const SummaryStatus: React.FC<SummaryStatusProps> = ({ sessionId, onSummaryReady }) => {
  const [status, setStatus] = useState<SessionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  
  const checkStatus = async () => {
    try {
      const response = await api.getSessionStatus(sessionId);
      const data = response.data;
      setStatus({
        sessionEnded: data?.ended || false,
        summaryStarted: data?.summary_started || false,
        summaryEnded: data?.summarized || false,
      });

      if (data?.summarized) {
        onSummaryReady();
      }
    } catch (err) {
      console.error('Error fetching session status:', err);
      setError('Failed to fetch session status. Please try again.');
    }
  };

  useEffect(() => {
    checkStatus();
    const intervalId = setInterval(checkStatus, 10000); // Check every 10 seconds

    return () => clearInterval(intervalId);
  }, [sessionId]);

  const checkButton = async () => {
    router.push({
        pathname: router.pathname,
        query: router.query,
      });

  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (!status) {
    return <p>Checking summary status...</p>;
  }

  if (status.summaryStarted && !status.summaryEnded) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={styles.generatingStatus}
      >
        <p>Your data is being generated. Please wait a moment.</p>
        <motion.button
          onClick={checkButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={styles.retryButton}
        >
          Check Again
        </motion.button>
      </motion.div>
    );
  }

  return null; // Don't render anything if the summary is ready
};

export default SummaryStatus;