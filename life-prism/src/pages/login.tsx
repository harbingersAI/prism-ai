// Login.tsx
import React from 'react';
import AuthForm from '@/components/Auth/AuthForm';
import styles from '@/styles/pages/Login.module.scss';
import Layout from '@/components/Layout/Layout';

const Login: React.FC = () => {
  return (
    <>
    <Layout>
    <div className={styles.loginContainer}>
      <div className={styles.loginContent}>
        <div className={styles.loginInfo}>
          <h1>Welcome to Your Mental Health Journey</h1>
          <p>Start your path to better well-being today. Join our community of supportive individuals and access powerful tools for personal growth.</p>
        </div>
        <AuthForm />
      </div>
    </div>
    </Layout></>
  );
};

export default Login;