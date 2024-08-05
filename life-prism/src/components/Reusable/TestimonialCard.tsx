import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteLeft, FaQuoteRight, FaStar, FaPlayCircle, FaPauseCircle } from 'react-icons/fa';
import styles from '@/styles/components/Reusable/TestimonialCard.module.scss';

export interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  rating?: number;
  videoUrl?: string;
  variant?: 'default' | 'compact' | 'featured';
  animationDelay?: number;
  className?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  role,
  avatar,
  rating,
  videoUrl,
  variant = 'default',
  animationDelay = 0,
  className = '',
}) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        delay: animationDelay,
        ease: 'easeOut'
      }
    }
  };

  const quoteVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3, 
        delay: animationDelay + 0.2
      }
    }
  };

  const renderRating = () => {
    return (
      <div className={styles.rating} aria-label={`Rating: ${rating} out of 5 stars`}>
        {[...Array(5)].map((_, index) => (
          <FaStar 
            key={index}
            className={index < (rating || 0) ? styles.starFilled : styles.starEmpty}
          />
        ))}
      </div>
    );
  };

  const handleVideoToggle = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  const cardClassName = `
    ${styles.testimonialCard} 
    ${styles[variant]}
    ${className}
  `.trim();

  return (
    <motion.div
      className={cardClassName}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.quoteWrapper}>
        <motion.div className={styles.quoteIcon} variants={quoteVariants}>
          <FaQuoteLeft aria-hidden="true" />
        </motion.div>
        <blockquote className={styles.quote}>{quote}</blockquote>
        <motion.div className={styles.quoteIcon} variants={quoteVariants}>
          <FaQuoteRight aria-hidden="true" />
        </motion.div>
      </div>

      <div className={styles.authorInfo}>
        {avatar && (
          <div className={styles.avatar}>
            <Image src={avatar} alt={author} width={64} height={64} />
          </div>
        )}
        <div className={styles.authorDetails}>
          <strong className={styles.authorName}>{author}</strong>
          {role && <span className={styles.authorRole}>{role}</span>}
        </div>
      </div>

      {rating !== undefined && renderRating()}

      {videoUrl && (
        <div className={styles.videoWrapper}>
          <AnimatePresence>
            {isVideoPlaying ? (
              <motion.video
                key="video"
                src={videoUrl}
                controls
                autoPlay
                className={styles.video}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            ) : (
              <motion.div
                key="placeholder"
                className={styles.videoPlaceholder}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Image src="/images/video-placeholder.jpg" alt="Video thumbnail" layout="fill" objectFit="cover" />
              </motion.div>
            )}
          </AnimatePresence>
          <button className={styles.videoToggle} onClick={handleVideoToggle} aria-label={isVideoPlaying ? "Pause video" : "Play video"}>
            {isVideoPlaying ? <FaPauseCircle /> : <FaPlayCircle />}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default TestimonialCard;