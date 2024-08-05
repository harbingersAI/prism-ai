import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '@/styles/components/Session/Timer.module.scss';

interface TimerProps {
  endTime: number;
  onTimerEnd: () => void;
}

const Timer: React.FC<TimerProps> = ({ endTime, onTimerEnd }) => {
  const [remainingTime, setRemainingTime] = useState(0);
  const [timerState, setTimerState] = useState<'normal' | 'warning' | 'critical'>('normal');

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      setRemainingTime(remaining);

      if (remaining === 0) {
        onTimerEnd();
      } else if (remaining < 60000) { // Less than 1 minute
        setTimerState('critical');
      } else if (remaining < 300000) { // Less than 5 minutes
        setTimerState('warning');
      } else {
        setTimerState('normal');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endTime, onTimerEnd]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: (minutes % 60).toString().padStart(2, '0'),
      seconds: (seconds % 60).toString().padStart(2, '0')
    };
  };

  const { hours, minutes, seconds } = formatTime(remainingTime);

  return (
    <motion.div
      className={`${styles.timer} ${styles[timerState + 'State']}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.timeRemaining}>
        <span className={styles.timeUnit}>
          {hours}
          <span className={styles.label}>Hours</span>
        </span>
        <span className={styles.timeUnit}>
          {minutes}
          <span className={styles.label}>Minutes</span>
        </span>
        <span className={styles.timeUnit}>
          {seconds}
          <span className={styles.label}>Seconds</span>
        </span>
      </div>
    </motion.div>
  );
};

export default Timer;