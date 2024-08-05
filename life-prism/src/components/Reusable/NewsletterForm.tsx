import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaCheck, FaTimes } from 'react-icons/fa';
import styles from '@/styles/components/Reusable/NewsletterForm.module.scss';

interface NewsletterFormProps {
  onSubmit: (email: string) => Promise<void>;
  className?: string;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ onSubmit, className = '' }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setSubmitStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await onSubmit(email);
      setSubmitStatus('success');
      setEmail('');
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const inputVariants = {
    focus: { scale: 1.02, boxShadow: '0 0 0 3px rgba(var(--color-primary-rgb), 0.3)', transition: { duration: 0.2 } },
    blur: { scale: 1, boxShadow: 'none', transition: { duration: 0.2 } },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  return (
    <motion.div
      className={`${styles.newsletterForm} ${className}`}
      initial="hidden"
      animate="visible"
      variants={formVariants}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputWrapper}>
          <FaEnvelope className={styles.inputIcon} />
          <motion.input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className={styles.input}
            required
            variants={inputVariants}
            whileFocus="focus"
            initial="blur"
            animate="blur"
          />
        </div>
        <motion.button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </motion.button>
      </form>

      <AnimatePresence>
        {submitStatus === 'success' && (
          <motion.div
            className={`${styles.message} ${styles.successMessage}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <FaCheck /> Thank you for subscribing!
          </motion.div>
        )}
        {submitStatus === 'error' && (
          <motion.div
            className={`${styles.message} ${styles.errorMessage}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <FaTimes /> {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NewsletterForm;