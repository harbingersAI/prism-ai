import React from 'react';
import Layout from '@/components/Layout/Layout';
import SEO from '@/components/SEO';
import styles from '@/styles/pages/policy.module.scss';

const PrivacyPage = () => {
  return (
    <Layout>
      <SEO 
        title="Privacy Policy | Prism Mental Health"
        description="Privacy Policy for Prism Mental Health. Learn how we collect, use, and protect your personal information on our AI-powered mental health support platform."
      />
      <div className={styles.policyContainer}>
        <h1 className={styles.title}>Privacy Policy</h1>

        <section className={styles.summary}>
          <h2 className={styles.summaryTitle}>Summary</h2>
          <ul className={styles.summaryList}>
            <li className={styles.summaryListItem}>We collect and process personal data to provide our AI-powered mental health support services.</li>
            <li className={styles.summaryListItem}>We use AI71 API to enhance our services and user experience.</li>
            <li className={styles.summaryListItem}>Your data is securely stored and processed in compliance with GDPR and other applicable laws.</li>
            <li className={styles.summaryListItem}>We do not sell your personal data to third parties.</li>
            <li className={styles.summaryListItem}>You have control over your data and can exercise your rights as outlined in this policy.</li>
            <li className={styles.summaryListItem}>We use cookies and similar technologies to improve your experience on our platform.</li>
          </ul>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>1. Introduction</h2>
          <p className={styles.paragraph}>Prism Mental Health (&quot;Prism&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our AI-powered mental health support platform.</p>
          <p className={styles.paragraph}>Prism is operated by Vega-D Ltd, located at st. Petiofi no.1, region: Center, city: Plovdiv, country: Bulgaria, 4001. If you have any questions or concerns about our privacy practices, please contact us at info@harbingersai.one.</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>2. Information We Collect</h2>
          <h3 className={styles.subsectionTitle}>2.1 Personal Information</h3>
          <p className={styles.paragraph}>We collect the following types of personal information:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Contact information (e.g., name, email address, phone number)</li>
            <li className={styles.listItem}>Account credentials (e.g., username, password)</li>
            <li className={styles.listItem}>Demographic information (e.g., age, gender, location)</li>
            <li className={styles.listItem}>Mental health-related information provided during interactions with our platform</li>
            <li className={styles.listItem}>Usage data (e.g., interactions with our services, access times, pages viewed)</li>
          </ul>

          <h3 className={styles.subsectionTitle}>2.2 Automatically Collected Information</h3>
          <p className={styles.paragraph}>We automatically collect certain information when you use Prism, including:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>IP address</li>
            <li className={styles.listItem}>Device information (e.g., device type, operating system, browser type)</li>
            <li className={styles.listItem}>Log data (e.g., access times, pages viewed, error logs)</li>
            <li className={styles.listItem}>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>3. How We Use Your Information</h2>
          <p className={styles.paragraph}>We use your personal information for the following purposes:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>To provide and improve our AI-powered mental health support services</li>
            <li className={styles.listItem}>To personalize your experience on our platform</li>
            <li className={styles.listItem}>To communicate with you about our services, updates, and promotions</li>
            <li className={styles.listItem}>To analyze usage patterns and improve our platform&apos;s functionality</li>
            <li className={styles.listItem}>To detect, prevent, and address technical issues or fraudulent activities</li>
            <li className={styles.listItem}>To comply with legal obligations and enforce our terms of service</li>
          </ul>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>4. AI71 API Integration</h2>
          <p className={styles.paragraph}>Prism uses the AI71 API to enhance our services and provide more accurate and personalized mental health support. By using our platform, you agree that we may process your data using AI71&apos;s technology. This processing may include:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Natural language processing of your interactions with our platform</li>
            <li className={styles.listItem}>Generation of personalized responses and insights</li>
            <li className={styles.listItem}>Analysis of patterns to improve the accuracy and effectiveness of our services</li>
          </ul>
          <p className={styles.paragraph}>We ensure that our use of AI71 API complies with all applicable data protection laws and regulations.</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>5. Data Sharing and Disclosure</h2>
          <p className={styles.paragraph}>We may share your personal information with the following parties:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Service providers and partners who assist us in delivering our services</li>
            <li className={styles.listItem}>AI71, as part of our API integration, to process and analyze data</li>
            <li className={styles.listItem}>Legal authorities, when required by law or to protect our rights and interests</li>
          </ul>
          <p className={styles.paragraph}>We do not sell your personal information to third parties for marketing purposes.</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>6. Data Security</h2>
          <p className={styles.paragraph}>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>7. Your Rights and Choices</h2>
          <p className={styles.paragraph}>You have certain rights regarding your personal information, including:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>The right to access and receive a copy of your personal data</li>
            <li className={styles.listItem}>The right to rectify inaccurate or incomplete personal data</li>
            <li className={styles.listItem}>The right to request deletion of your personal data</li>
            <li className={styles.listItem}>The right to restrict or object to the processing of your personal data</li>
            <li className={styles.listItem}>The right to data portability</li>
            <li className={styles.listItem}>The right to withdraw consent at any time</li>
          </ul>
          <p className={styles.paragraph}>To exercise these rights, please contact us using the information provided in the &quot;Contact Information&quot; section.</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>8. Cookies and Tracking Technologies</h2>
          <p className={styles.paragraph}>We use cookies and similar tracking technologies to enhance your experience on our platform. You can control cookie preferences through your browser settings. However, disabling cookies may limit your ability to use certain features of our service.</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>9. Children&apos;s Privacy</h2>
          <p className={styles.paragraph}>Our services are not intended for children under the age of 16. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>10. International Data Transfers</h2>
          <p className={styles.paragraph}>Your personal information may be transferred to and processed in countries other than your country of residence. We ensure that such transfers comply with applicable data protection laws and that appropriate safeguards are in place.</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>11. Changes to This Privacy Policy</h2>
          <p className={styles.paragraph}>We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>12. Contact Information</h2>
          <p className={styles.paragraph}>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
          <p className={styles.paragraph}>Vega-D Ltd</p>
          <p className={styles.paragraph}>Email: info@harbingersai.one</p>
          <p className={styles.paragraph}>Address: st. Petiofi no.1, region: Center, city: Plovdiv, country: Bulgaria, 4001</p>
        </section>

        <p className={styles.lastUpdated}>Last updated: [5th of August 2024]</p>
      </div>
    </Layout>
  );
};

export default PrivacyPage;