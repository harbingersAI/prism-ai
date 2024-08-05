// PsychometryProfilePage.tsx
import React from 'react';
import Layout from '@/components/Layout/Layout';
import PsychometryProfile from '@/components/Profile/Profile';
import styles from '@/styles/pages/PsychometryProfilePage.module.scss';

const PsychometryProfilePage: React.FC = () => {
  return (
    <Layout>
      <div className={styles.psychometryProfileContainer}>
        <div className={styles.psychometryProfileContent}>
          <div className={styles.profileInfo}>
            <h1>Your Psychological Profile</h1>
            <p>
              Explore your personalized psychological insights. This profile provides a comprehensive 
              overview of your emotional state, cognitive patterns, and behavioral tendencies, 
              helping you understand yourself better and track your mental health journey.
            </p>
          </div>
          <PsychometryProfile />
        </div>
      </div>
    </Layout>
  );
};

export default PsychometryProfilePage;