import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Button from '@/components/Reusable/Button';
import styles from '@/styles/components/Reusable/FeatureCard.module.scss';

export interface FeatureCardProps {
  title: string;
  description: string;
  icon?: string;
  image?: string;
  details?: string;
  benefits?: string[];
  ctaText?: string;
  ctaLink?: string;
  variant?: 'default' | 'highlight' | 'minimal' | 'expanded';
  layout?: 'vertical' | 'horizontal';
  animationDelay?: number;
  onClick?: () => void;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  image,
  details,
  benefits,
  ctaText,
  ctaLink,
  variant = 'default',
  layout = 'vertical',
  animationDelay = 0,
  onClick,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

  const expandVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { height: 'auto', opacity: 1, transition: { duration: 0.3, ease: 'easeInOut' } }
  };

  const iconVariants = {
    hover: { 
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.2, ease: 'easeInOut' }
    }
  };

  const cardClassName = `
    ${styles.featureCard} 
    ${styles[variant]} 
    ${styles[layout]}
    ${onClick ? styles.clickable : ''}
    ${className}
  `.trim();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const renderIcon = () => (
    <motion.div className={styles.icon} variants={iconVariants} whileHover="hover">
      <Image src={icon!} alt="" width={48} height={48} />
    </motion.div>
  );

  const renderImage = () => (
    <div className={styles.image}>
      <Image src={image!} alt="" layout="fill" objectFit="cover" />
    </div>
  );

  const renderBenefits = () => (
    <ul className={styles.benefits}>
      {benefits?.map((benefit, index) => (
        <motion.li 
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * index }}
        >
          {benefit}
        </motion.li>
      ))}
    </ul>
  );

  const content = (
    <>
      {(icon || image) && (
        <div className={styles.media}>
          {icon && renderIcon()}
          {image && renderImage()}
        </div>
      )}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        {variant === 'expanded' && (
          <>
            <button className={styles.expandToggle} onClick={toggleExpand}>
              {isExpanded ? 'Show Less' : 'Show More'}
              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  className={styles.expandedContent}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  variants={expandVariants}
                >
                  {details && <p className={styles.details}>{details}</p>}
                  {benefits && renderBenefits()}
                  {ctaText && ctaLink && (
                    <Button 
                      as="link" 
                      href={ctaLink} 
                      variant="secondary" 
                      className={styles.cta}
                    >
                      {ctaText}
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </>
  );

  return (
    <motion.div
      className={cardClassName}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={onClick ? { scale: 1.03 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
    >
      {content}
    </motion.div>
  );
};

export default FeatureCard;