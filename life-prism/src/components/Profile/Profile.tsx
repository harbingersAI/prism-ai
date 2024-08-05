import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBrain, FaChartLine, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import api from '@/utils/Api';
import styles from '@/styles/pages/PsychometryProfile.module.scss';

interface PsychometricProfile {
  profile?: {
    emotionalState?: {
      mood?: { value: string; intensity: number };
      anxiety?: number;
      depression?: number;
      stress?: number;
      emotionalRegulation?: number;
    };
    cognitivePatterns?: {
      negativeThoughts?: { frequency: number; impact: number };
      selfEsteem?: number;
      problemSolvingSkills?: number;
      cognitiveFlexibility?: number;
      attentionFocus?: number;
    };
    behavioralTendencies?: {
      socialInteraction?: number;
      sleepQuality?: number;
      substanceUse?: number;
      selfCare?: number;
      productivity?: number;
    };
    interpersonalDynamics?: {
      relationshipSatisfaction?: number;
      communicationSkills?: number;
      conflictResolution?: number;
    };
    coreIssues?: { issue: string; severity: number }[];
    copingMechanisms?: { mechanism: string; effectiveness: number }[];
    goals?: { goal: string; progress: number }[];
    resilienceFactors?: string[];
    progressNotes?: string;
  };
}

const PsychometryProfile: React.FC = () => {
  const [psychometricProfile, setPsychometricProfile] = useState<PsychometricProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getAuthToken } = useAuth();
  const router = useRouter();

  const fetchPsychometricProfile = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Authentication required. Please log in.');
        return;
      }

      const response = await api.getLatestPsychometricProfile();
      const profileData = response.data.psych_profile_json;
      console.log(profileData);

      if ('error' in profileData) {
        setError('The user psychometry profile is unavailable. There was an error. Contact support.');
      } else if (Object.keys(profileData).length === 0) {
        router.push('/chat');
      } else {
        setPsychometricProfile(profileData as PsychometricProfile);
      }
    } catch (err) {
      console.error('Error fetching psychometric profile:', err);
      setError('Failed to fetch psychometric profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [getAuthToken, router]);

  useEffect(() => {
    fetchPsychometricProfile();
  }, [fetchPsychometricProfile]);

  const RadarChart: React.FC<{ data: { [key: string]: number } }> = ({ data }) => {
    const maxValue = Math.max(...Object.values(data));
    const angleStep = (Math.PI * 2) / Object.keys(data).length;

    const points = Object.entries(data).map(([key, value], index) => {
      const angle = index * angleStep;
      const radius = (value / maxValue) * 100;
      return `${Math.cos(angle) * radius},${Math.sin(angle) * radius}`;
    }).join(' ');

    return (
      <div className={styles.radarChart}>
        <svg viewBox="-100 -100 200 200">
          {Object.keys(data).map((key, index) => {
            const angle = index * angleStep;
            return (
              <React.Fragment key={key}>
                <line
                  x1={0}
                  y1={0}
                  x2={Math.cos(angle) * 100}
                  y2={Math.sin(angle) * 100}
                  stroke="#ddd"
                />
                <text
                  x={Math.cos(angle) * 120}
                  y={Math.sin(angle) * 120}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {key}
                </text>
              </React.Fragment>
            );
          })}
          <motion.polygon
            points={points}
            fill="rgba(75, 192, 192, 0.2)"
            stroke="rgb(75, 192, 192)"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
        </svg>
      </div>
    );
  };

  const BarChart: React.FC<{ data: { [key: string]: number } }> = ({ data }) => {
    const maxValue = Math.max(...Object.values(data));

    return (
      <div className={styles.barChart}>
        {Object.entries(data).map(([key, value], index) => (
          <div key={key} className={styles.barChartItem}>
            <span className={styles.barLabel}>{key}</span>
            <motion.div
              className={styles.barFill}
              initial={{ width: 0 }}
              animate={{ width: `${(value / maxValue) * 100}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            />
            <span className={styles.barValue}>{value}</span>
          </div>
        ))}
      </div>
    );
  };

  const emotionalStateChart = useMemo(() => {
    if (!psychometricProfile?.profile?.emotionalState) return null;
    const { emotionalState } = psychometricProfile.profile;
    const chartData = Object.entries(emotionalState).reduce((acc, [key, value]) => {
      if (typeof value === 'number') {
        acc[key] = value;
      } else if (value && 'intensity' in value) {
        acc[key] = value.intensity;
      }
      return acc;
    }, {} as { [key: string]: number });

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.chartSection}
      >
        <h3>Emotional State</h3>
        <RadarChart data={chartData} />
      </motion.div>
    );
  }, [psychometricProfile]);

  const cognitivePatternChart = useMemo(() => {
    if (!psychometricProfile?.profile?.cognitivePatterns) return null;
    const { cognitivePatterns } = psychometricProfile.profile;
    const chartData = Object.entries(cognitivePatterns).reduce((acc, [key, value]) => {
      if (typeof value === 'number') {
        acc[key] = value;
      } else if (value && 'frequency' in value) {
        acc[key] = value.frequency;
      }
      return acc;
    }, {} as { [key: string]: number });

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.chartSection}
      >
        <h3>Cognitive Patterns</h3>
        <BarChart data={chartData} />
      </motion.div>
    );
  }, [psychometricProfile]);

  const renderSection = useCallback((title: string, data: any, renderFunc: (item: any, index: number) => React.ReactNode) => {
    if (!data || data.length === 0) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.section}
      >
        <h3>{title}</h3>
        <ul>
          {data.map((item: any, index: number) => (
            <li key={index}>{renderFunc(item, index)}</li>
          ))}
        </ul>
      </motion.div>
    );
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingContainer}>
          <FaSpinner className={styles.spinner} />
          <p>Loading your psychometric profile...</p>
        </div>
      );
    }

    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={styles.errorContainer}
        >
          <FaExclamationTriangle size={48} />
          <h2>Error</h2>
          <p>{error}</p>
        </motion.div>
      );
    }

    if (!psychometricProfile?.profile) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={styles.emptyContainer}
        >
          <FaBrain size={48} />
          <h2>No Profile Data</h2>
          <p>Seems like you haven&apos;t had your first session. Go ahead and start your first session!</p>
          <button onClick={() => router.push('/chat')}>Start First Session</button>
        </motion.div>
      );
    }

    return (
      <AnimatePresence>
        <motion.div
          key="profile"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className={styles.profileContainer}
        >
          <h2><FaBrain /> Your Psychometric Profile</h2>
          
          {emotionalStateChart}
          {cognitivePatternChart}
          
          {renderSection("Core Issues", psychometricProfile.profile.coreIssues, (issue) => (
            <div className={styles.issueItem}>
              <span>{issue.issue}</span>
              <motion.div
                className={styles.severityBar}
                initial={{ width: 0 }}
                animate={{ width: `${issue.severity * 10}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          ))}
          
          {renderSection("Goals", psychometricProfile.profile.goals, (goal) => (
            <div className={styles.goalItem}>
              <span>{goal.goal}</span>
              <motion.div
                className={styles.progressBar}
                initial={{ width: 0 }}
                animate={{ width: `${goal.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          ))}
          
          {renderSection("Coping Mechanisms", psychometricProfile.profile.copingMechanisms, (mechanism) => (
            <div className={styles.mechanismItem}>
              <span>{mechanism.mechanism}</span>
              <motion.div
                className={styles.effectivenessBar}
                initial={{ width: 0 }}
                animate={{ width: `${mechanism.effectiveness * 10}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          ))}
          
          {psychometricProfile.profile.resilienceFactors && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.section}
            >
              <h3>Resilience Factors</h3>
              <ul className={styles.resilienceList}>
                {psychometricProfile.profile.resilienceFactors.map((factor, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {factor}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
          
          {psychometricProfile.profile.progressNotes && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.section}
            >
              <h3>Progress Notes</h3>
              <p className={styles.progressNotes}>{psychometricProfile.profile.progressNotes}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className={styles.psychometryProfile}>
      <h1>Your Psychometric Profile</h1>
      {renderContent()}
    </div>
  );
};

export default PsychometryProfile;