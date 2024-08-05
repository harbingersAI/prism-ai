import React from 'react';
import { motion } from 'framer-motion';
import { FaBrain, FaLock, FaChartLine, FaUserMd, FaCalendarAlt, FaRobot } from 'react-icons/fa';
import { RiMentalHealthLine } from 'react-icons/ri';
import SEO from '@/components/SEO';
import Layout from '@/components/Layout/Layout';
import Button from '@/components/Reusable/Button';
import styles from '@/styles/pages/LearnMore.module.scss';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const LearnMore: React.FC = () => {
  return (
    <Layout>
      <SEO 
        title="Learn More | AI Psychologist"
        description="Discover how Prism's AI psychologist can empower your mental health journey with accessible, personalized therapy sessions and insights."
        keywords="AI psychologist, mental health, therapy, accessibility, personalized insights"
      />
      <main className={styles.learnMore}>


        <section className={styles.features}>
          <h2 className={styles.sectionTitle}>Why Choose Prism?</h2>
          <div className={styles.featureGrid}>

            <motion.div className={styles.featureCard} variants={fadeIn}>
              <FaChartLine className={styles.featureIcon} />
              <h3>Track Your Progress</h3>
              <p>Gain insights into your mental health journey with detailed analytics and summaries.</p>
            </motion.div>
            <motion.div className={styles.featureCard} variants={fadeIn}>
              <FaCalendarAlt className={styles.featureIcon} />
              <h3>Flexible Sessions</h3>
              <p>Schedule weekly sessions that fit your lifestyle, available 24/7.</p>
            </motion.div>
            <motion.div className={styles.featureCard} variants={fadeIn}>
              <RiMentalHealthLine className={styles.featureIcon} />
              <h3>Personalized Approach</h3>
              <p>Our AI adapts to your unique needs, providing tailored support and strategies.</p>
            </motion.div>
          </div>
        </section>

        <section className={styles.howItWorks}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <div className={styles.steps}>
            <motion.div className={styles.step} variants={fadeIn}>
              <div className={styles.stepIcon}><FaUserMd /></div>
              <h3>Sign Up</h3>
              <p>Create your account and complete a brief initial assessment.</p>
            </motion.div>
            <motion.div className={styles.step} variants={fadeIn}>
              <div className={styles.stepIcon}><FaCalendarAlt /></div>
              <h3>Access Sessions</h3>
              <p>Start your weekly sessions with your AI psychologist at your convenience.</p>
            </motion.div>
            <motion.div className={styles.step} variants={fadeIn}>
              <div className={styles.stepIcon}><FaRobot /></div>
              <h3>Engage in Therapy</h3>
              <p>Participate in text-based sessions, guided by advanced AI.</p>
            </motion.div>
            <motion.div className={styles.step} variants={fadeIn}>
              <div className={styles.stepIcon}><FaBrain /></div>
              <h3>Receive Insights</h3>
              <p>Get personalized summaries and actionable strategies after each session.</p>
            </motion.div>
          </div>
        </section>

        <section className={styles.empowerment}>
          <div className={styles.empowermentContent}>
            <h2 className={styles.emph2}>Take Charge of Your Mental Health</h2>
            <ul>
              <motion.li variants={fadeIn}>No judgment, just support</motion.li>
              <motion.li variants={fadeIn}>Available whenever you need it</motion.li>
              <motion.li variants={fadeIn}>Affordable alternative to traditional therapy</motion.li>
              <motion.li variants={fadeIn}>Consistent progress tracking</motion.li>
            </ul>
            <Button centered href="/login" variant="secondary" size="large">Begin Your Journey</Button>
          </div>
        </section>

        <section className={styles.faq}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <motion.div className={styles.faqGrid} variants={fadeIn}>
            <div className={styles.faqItem}>
              <h3>Is AI therapy as effective as traditional therapy?</h3>
              <p>While AI therapy can&apos;t replace human therapists in all scenarios, it offers unique advantages such as 24/7 availability, consistency, and data-driven insights that can be highly effective for many individuals.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>Can I use Prism alongside traditional therapy?</h3>
              <p>Absolutely! Prism can be a valuable complement to traditional therapy, offering additional support and insights between sessions.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>What if I need immediate crisis support?</h3>
              <p>While Prism is not designed for crisis intervention, we provide resources and hotlines for immediate support if needed. Always seek emergency services in critical situations.</p>
            </div>
          </motion.div>
        </section>

        <section className={styles.cta}>
          <h2>Ready to Transform Your Mental Health Journey?</h2>
          <p>Join Prism today and experience the power of AI-guided therapy and self-reflection.</p>
          <Button centered href="/login" variant="primary" size="large">Start Your Free Trial</Button>
        </section>
      </main>
    </Layout>
  );
};

export default LearnMore;