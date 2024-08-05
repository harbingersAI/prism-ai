import React from 'react';
import Layout from '@/components/Layout/Layout';
import SEO from '@/components/SEO';
import styles from '@/styles/pages/policy.module.scss';

const TermsPage = () => {
  return (
    <Layout>
      <SEO 
        title="Terms of Service | Prism Mental Health"
        description="Terms of Service for Prism Mental Health. Learn about your rights and responsibilities when using our AI-powered mental health support platform."
      />
      <div className={styles.policyContainer}>
        <h1 className={styles.title}>Terms of Service</h1>

        <section className={styles.summary}>
          <h2 className={styles.summaryTitle}>Summary</h2>
          <ul className={styles.summaryList}>
            <li className={styles.summaryListItem}>Prism is an AI-powered mental health support platform operated by Vega-D Ltd.</li>
            <li className={styles.summaryListItem}>By using Prism, you agree to these terms and our privacy policy.</li>
            <li className={styles.summaryListItem}>We use AI71 API to provide our services and enhance user experience.</li>
            <li className={styles.summaryListItem}>You are responsible for the content you create and share on Prism.</li>
            <li className={styles.summaryListItem}>We respect your privacy and protect your data, but we use it to improve our services.</li>
            <li className={styles.summaryListItem}>Misuse of the platform may result in termination of your account.</li>
          </ul>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>1. Introduction</h2>
          <h3 className={styles.subsectionTitle}>1.1 Overview</h3>
          <p className={styles.paragraph}>Welcome to Prism Mental Health (&quot;Prism&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). Prism is operated by Vega-D Ltd. By accessing or using our application, you agree to be bound by these Terms of Service (&quot;Terms&quot;). These Terms govern your use of Prism and any related services provided by us. Prism uses the AI71 API to provide its services. By using Prism, you agree to the terms outlined herein.</p>
          
          <h3 className={styles.subsectionTitle}>1.2 Purpose</h3>
          <p className={styles.paragraph}>Prism is an AI-powered mental health support platform designed to provide personalized insights, coping strategies, and emotional support. We leverage the AI71 API to enhance user experience by providing advanced natural language processing capabilities, enabling more accurate and empathetic responses to user inputs.</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>2. User Responsibilities</h2>
          <h3 className={styles.subsectionTitle}>2.1 Compliance with Laws</h3>
          <p className={styles.paragraph}>You must comply with all applicable local, state, national, and international laws and regulations when using Prism. This includes, but is not limited to, laws regarding data protection, intellectual property, and content sharing.</p>

          <h3 className={styles.subsectionTitle}>2.2 Accurate Information</h3>
          <p className={styles.paragraph}>You agree to provide accurate, current, and complete information when interacting with Prism. This includes information provided during registration, account creation, or any other use of our services.</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>3. Acceptable Use Policy</h2>
          <h3 className={styles.subsectionTitle}>3.1 Prohibited Uses</h3>
          <p className={styles.paragraph}>The following activities are strictly prohibited when using Prism:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Misuse of the AI71 API or attempting to bypass usage limits</li>
            <li className={styles.listItem}>Generating or disseminating harmful, offensive, or illegal content</li>
            <li className={styles.listItem}>Reverse engineering or attempting to extract the underlying code of the API or Prism application</li>
            <li className={styles.listItem}>Using Prism to harass, bully, or harm others</li>
            <li className={styles.listItem}>Impersonating another person or entity</li>
            <li className={styles.listItem}>Attempting to gain unauthorized access to other users&apos; accounts or our systems</li>
          </ul>

          <h3 className={styles.subsectionTitle}>3.2 Content Standards</h3>
          <p className={styles.paragraph}>Users are not allowed to create, upload, or share content that:</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Is illegal, obscene, defamatory, threatening, or discriminatory</li>
            <li className={styles.listItem}>Infringes on intellectual property rights of others</li>
            <li className={styles.listItem}>Contains malware, viruses, or other harmful code</li>
            <li className={styles.listItem}>Violates the privacy or publicity rights of others</li>
          </ul>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>4. User Content</h2>
          <h3 className={styles.subsectionTitle}>4.1 Ownership</h3>
          <p className={styles.paragraph}>You retain ownership of any content you create or share on Prism. However, by using our services, you grant Prism a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content as necessary to provide and improve our services.</p>

          <h3 className={styles.subsectionTitle}>4.2 Responsibility</h3>
          <p className={styles.paragraph}>You are solely responsible for the content you generate and share on Prism. You must ensure that your content does not violate any third-party rights or laws. We reserve the right to remove any content that violates these Terms or that we deem inappropriate.</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>5. Data Privacy</h2>
          <h3 className={styles.subsectionTitle}>5.1 Data Collection</h3>
          <p className={styles.paragraph}>We collect and process personal data as described in our Privacy Policy. By using Prism, you consent to such data collection and processing.</p>

          <h3 className={styles.subsectionTitle}>5.2 Third-Party Sharing</h3>
          <p className={styles.paragraph}>Your data may be shared with third parties, including AI71, for the purpose of providing and improving our services. Please refer to our Privacy Policy for more details on how we handle your data.</p>

          <h3 className={styles.subsectionTitle}>5.3 Security</h3>
          <p className={styles.paragraph}>We implement reasonable security measures to protect your data. However, no method of transmission over the internet or electronic storage is 100% secure. You are responsible for maintaining the confidentiality of your account credentials.</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>6. API Usage</h2>
          <h3 className={styles.subsectionTitle}>6.1 API Limits</h3>
          <p className={styles.paragraph}>Use of the AI71 API through Prism may be subject to rate limits or usage quotas. We will make reasonable efforts to notify you of any significant changes to these limits.</p>

          <h3 className={styles.subsectionTitle}>6.2 Reliability</h3>
          <p className={styles.paragraph}>While we strive to ensure consistent API availability, there may be downtimes or limitations outside our control. We are not responsible for any losses or damages resulting from API unavailability.</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>7. Liability and Disclaimers</h2>
          <h3 className={styles.subsectionTitle}>7.1 No Warranty</h3>
          <p className={styles.paragraph}>Prism is provided &quot;as is&quot; and &quot;as available&quot; without any warranties of any kind, either express or implied. We do not warrant that the app will be uninterrupted, error-free, or free from harmful components.</p>

          <h3 className={styles.subsectionTitle}>7.2 Limitation of Liability</h3>
          <p className={styles.paragraph}>To the fullest extent permitted by law, Vega-D Ltd and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of Prism.</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>8. Termination</h2>
          <h3 className={styles.subsectionTitle}>8.1 Grounds for Termination</h3>
          <p className={styles.paragraph}>We may terminate or suspend your access to Prism immediately, without prior notice or liability, for any reason, including but not limited to a breach of these Terms.</p>

          <h3 className={styles.subsectionTitle}>8.2 Consequences</h3>
          <p className={styles.paragraph}>Upon termination, your right to use Prism will immediately cease. We may delete or retain your data in accordance with our Privacy Policy and applicable laws.</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>9. Changes to Terms</h2>
          <h3 className={styles.subsectionTitle}>9.1 Notification</h3>
          <p className={styles.paragraph}>We may modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the &quot;Last updated&quot; date.</p>

          <h3 className={styles.subsectionTitle}>9.2 Continued Use</h3>
          <p className={styles.paragraph}>Your continued use of Prism after the changes have been posted constitutes your acceptance of the modified Terms.</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>10. Contact Information</h2>
          <p className={styles.paragraph}>If you have any questions about these Terms, please contact us at:</p>
          <p className={styles.paragraph}>Vega-D Ltd</p>
          <p className={styles.paragraph}>Email: info@harbingersai.one</p>
          <p className={styles.paragraph}>Address: st. Petiofi no.1, region: Center, city: Plovdiv, country: Bulgaria, 4001</p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>11. Governing Law and Dispute Resolution</h2>
          <h3 className={styles.subsectionTitle}>11.1 Jurisdiction</h3>
          <p className={styles.paragraph}>These Terms shall be governed by and construed in accordance with the laws of Bulgaria, without regard to its conflict of law provisions.</p>

          <h3 className={styles.subsectionTitle}>11.2 Resolution</h3>
          <p className={styles.paragraph}>Any disputes arising out of or relating to these Terms or your use of Prism shall be resolved through binding arbitration in accordance with the rules of the Bulgarian Chamber of Commerce and Industry. The arbitration shall take place in Plovdiv, Bulgaria, and shall be conducted in the English language.</p>
        </section>

        <p className={styles.lastUpdated}>Last updated: [5th of August 2024]</p>
      </div>
    </Layout>
  );
};

export default TermsPage;