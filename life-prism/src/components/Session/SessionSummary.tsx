// SessionSummary.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import api from '@/utils/Api';
import SummaryStatus from './SummaryStatus';
import styles from '@/styles/components/Session/SessionSummary.module.scss';

interface SessionSummaryProps {
  sessionId: string;
  startTime: string;
}

interface SessionInfo {
  session_summary?: string;
  session_analysis?: string;
  session_scores?: {
    sessionDetails?: {
      keyInsights?: string[];
      mainTopics?: string[];
      emotionalTone?: string;
      patientProgress?: {
        description?: string;
        rating?: number;
      };
      recommendedActions?: string[];
      planForNextSession?: string;
    };
  };
}

const SessionSummary: React.FC<SessionSummaryProps> = ({ sessionId, startTime }) => {
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  const { getAuthToken } = useAuth();

  useEffect(() => {
    const fetchSessionInfo = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          setError('Authentication token not found. Please log in again.');
          setIsLoading(false);
          return;
        }

        const response = await api.getLatestSessionInfo(sessionId);
        setSessionInfo(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching session info:', err);
        setError('Failed to fetch session information. Please try again.');
        setIsLoading(false);
      }
    };

    fetchSessionInfo();
  }, [sessionId, getAuthToken]);

  const renderProgressBar = (value: number, max: number = 10) => (
    <div className={styles.progressBar}>
      <div
        className={styles.progressFill}
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );

  const renderSummaryContent = () => {
    if (!sessionInfo) return null;

    const { session_summary, session_analysis, session_scores } = sessionInfo;
    const sessionDetails = session_scores?.sessionDetails;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={styles.summaryContent}
      >
        <section className={styles.keyInfo}>
          <h2>Key Insights</h2>
          <ul>
            {sessionDetails?.keyInsights?.map((insight, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {insight}
              </motion.li>
            ))}
          </ul>

          <h2>Main Topics Discussed</h2>
          <ul>
            {sessionDetails?.mainTopics?.map((topic, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {topic}
              </motion.li>
            ))}
          </ul>

          <h2>Emotional Tone</h2>
          <p>{sessionDetails?.emotionalTone || 'Not available'}</p>

          <h2>Patient Progress</h2>
          <p>{sessionDetails?.patientProgress?.description || 'Not available'}</p>
          {sessionDetails?.patientProgress?.rating && renderProgressBar(sessionDetails.patientProgress.rating)}
        </section>

        <section className={styles.summarySection}>
          <h2>Session Summary</h2>
          <p>
            {showFullSummary
              ? session_summary
              : `${session_summary?.substring(0, 150)}...`}
          </p>
          <button
            onClick={() => setShowFullSummary(!showFullSummary)}
            className={styles.readMoreButton}
          >
            {showFullSummary ? 'Read Less' : 'Read More'}
          </button>
        </section>

        <section className={styles.analysisSection}>
          <h2>Session Analysis</h2>
          <p>
            {showFullAnalysis
              ? session_analysis
              : `${session_analysis?.substring(0, 150)}...`}
          </p>
          <button
            onClick={() => setShowFullAnalysis(!showFullAnalysis)}
            className={styles.readMoreButton}
          >
            {showFullAnalysis ? 'Read Less' : 'Read More'}
          </button>
        </section>

        <section className={styles.recommendations}>
          <h2>Recommended Actions</h2>
          <ul>
            {sessionDetails?.recommendedActions?.map((action, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {action}
              </motion.li>
            ))}
          </ul>

          <h2>Plan for Next Session</h2>
          <p>{sessionDetails?.planForNextSession || 'Not available'}</p>
        </section>
      </motion.div>
    );
  };

  return (
    <div className={styles.sessionSummary}>
      <h1>Session Summary</h1>
      <p className={styles.sessionDate}>
        Session Date: {new Date(startTime).toLocaleDateString()}
      </p>

      <SummaryStatus
        sessionId={sessionId}
        onSummaryReady={() => setIsLoading(false)}
      />

      {isLoading ? (
        <p>Loading session summary...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <AnimatePresence>{renderSummaryContent()}</AnimatePresence>
      )}
    </div>
  );
};

export default SessionSummary;