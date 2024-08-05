import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import Layout from '@/components/Layout/Layout';
import Button from '@/components/Reusable/Button';
import FeatureCard from '@/components/Reusable/FeatureCard';
import styles from '@/styles/pages/Home.module.scss';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
};

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <Layout>
      <SEO 
        title="Home"
        description="Prism: Refracting chaos into clarity. AI-powered mental health support for your well-being journey."
        keywords="mental health, AI therapy, well-being, personalized insights, mindfulness"
      />

      <main className={styles.main}>
        <motion.section 
          className={styles.hero}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <div className={styles.heroContent}>
            <motion.h1 variants={slideUp} className={styles.title}>
              Refract Your Mind with <span className={styles.gradient}>Prism</span>
            </motion.h1>
            <motion.p variants={slideUp} className={styles.description}>
              Navigate your mental landscape with AI-powered insights and personalized tools.
            </motion.p>
            <motion.div variants={slideUp} className={styles.ctaContainer}>
              <Button href="/login" variant="primary" size="large">Get Started</Button>
              <Button href="/login" variant="secondary" size="large">Learn More</Button>
            </motion.div>
          </div>
          <motion.div variants={fadeIn} className={styles.heroImage}>
            <img src="/images/image-hero-3.png" alt="Prism mental health concept illustration" />
          </motion.div>
        </motion.section>

        <section className={styles.features}>
          <h2 className={styles.sectionTitle}>Illuminate Your Path</h2>
          <div className={styles.featureGrid}>
            <FeatureCard 
              title="Reality Checks"
              description="AI-powered sessions to help you understand and process your thoughts."
              icon="/images/icon-1.png"
              variant="expanded"
              details="Our advanced AI analyzes your responses and provides personalized insights to help you gain clarity and perspective."
              benefits={[
                "Real-time emotional analysis",
                "Personalized coping strategies",
                "Progress tracking over time"
              ]}
              ctaText="Try a Session"
              ctaLink="/login"
            />
            <FeatureCard 
              title="Lifeline"
              description="Immediate support and resources when you need them most."
              icon="/images/icon-2.png"
              variant="expanded"
              details="Access a curated list of emergency contacts and crisis hotlines at the touch of a button."
              benefits={[
                "24/7 availability",
                "Location-based resources",
              ]}
              ctaText="Access Lifeline"
              ctaLink="/login"
            />
            <FeatureCard 
              title="Do a Deep Dive"
              description="Transform negative patterns into positive, actionable strategies."
              icon="/images/icon-3.png"
              variant="expanded"
              details="Identify and challenge your psychometry with our AI-first psychometry analysis."
              benefits={[
                "Deep analysis after each session",
                "Behavior pattern breakdown",
                "Analysis of key factors"
              ]}
              ctaText="Dive Into It"
              ctaLink="/login"
            />
            <FeatureCard 
              title="Deep AI Insights"
              description="Receive in-depth summaries of your AI therapy sessions."
              icon="/images/icon-4.png"
              variant="expanded"
              details="Gain valuable insights into your mental state and progress through comprehensive session summaries provided by our AI."
              benefits={[
                "Detailed session analysis",
                "Personalized growth recommendations",
              ]}
              ctaText="Start Today"
              ctaLink="/login"
            />
          </div>
        </section>

        <section className={styles.howItWorks}>
          <h2 className={styles.sectionTitle}>How Prism Works</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3>Connect</h3>
              <p>Sync Prism with your daily life through our intuitive app.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3>Reflect</h3>
              <p>Engage in AI-guided sessions to explore your mental state.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3>Refract</h3>
              <p>Receive personalized insights and actionable strategies.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <h3>Grow</h3>
              <p>Experience personal growth through AI-guided self-reflection.</p>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>Ready to Refract Your Reality?</h2>
          <p className={styles.ctaDescription}>Join others on their journey to mental clarity with AI-powered insights.</p>
          <Button  centered  href="/login" variant="primary" size="large">Start Your Journey Today</Button>
        </section>

        <section className={styles.faq}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h3>Is Prism a replacement for therapy?</h3>
              <p>While Prism is a powerful tool for mental health support, it&apos;s not intended to replace professional therapy. Always consult with a licensed mental health professional for serious concerns.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>How does Prism protect my privacy?</h3>
              <p>We take your privacy seriously. While our data is not end-to-end encrypted, we prioritize the security of your information. We partner with AI71 and use their Falcon180B model, providing enhanced security compared to other LLM APIs on the market.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>Can I use Prism offline?</h3>
              <p>Currently, Prism requires an internet connection to function. However, we&apos;re actively exploring the possibility of an offline version, which may be available in the near future.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>Is Prism available worldwide?</h3>
              <p>Prism is currently available in English-speaking countries. We&apos;re working on expanding to more languages and regions soon.</p>
            </div>
          </div>
        </section>

        <section className={styles.finalCta}>
          <h2 className={styles.finalCtaTitle}>Begin Your Mental Health Journey</h2>
          <p className={styles.finalCtaDescription}>Experience the power of AI-guided self-reflection and personal growth.</p>
          <Button  centered href="/login" variant="primary" size="large">Start with Prism Today</Button>
        </section>
      </main>
    </Layout>
  );
}