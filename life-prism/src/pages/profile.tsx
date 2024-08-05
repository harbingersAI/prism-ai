// pages/profile.tsx
import React, { useState, useEffect } from 'react';
import { withAuth } from '../components/withAuth';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/Api';
import { IUserProfile, IUpdateProfileData } from '../types/auth';
import Layout from '@/components/Layout/Layout';
import styles from '@/styles/pages/Profile.module.scss';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { logout, user, updateUser, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSaveProfile = async (updatedProfile: Partial<IUserProfile>) => {
    try {
      const validUpdateData: IUpdateProfileData = {
        full_name: updatedProfile.full_name || undefined,
        timezone: updatedProfile.timezone || undefined,
        language_preference: updatedProfile.language_preference || undefined,
        marketing_opt_in: updatedProfile.marketing_opt_in
      };

      await api.updateProfile(validUpdateData);
      setIsEditing(false);
      updateUser(updatedProfile);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p>Loading profile...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className={styles.errorContainer}>
          <p>User not found. Please try again.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div 
        className={styles.dashboardContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={styles.pageTitle}>Dashboard</h1>
        {isEditing ? (
          <ProfileEditForm profile={user} onSave={handleSaveProfile} onCancel={() => setIsEditing(false)} />
        ) : (
          <ProfileDisplay profile={user} onEdit={() => setIsEditing(true)} />
        )}
        <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
      </motion.div>
    </Layout>
  );
};

const ProfileDisplay: React.FC<{ profile: IUserProfile; onEdit: () => void }> = ({ profile, onEdit }) => (
  <div className={styles.profileDisplay}>
    <h2>Profile</h2>
    <p><strong>Name:</strong> {profile.full_name || 'Not set'}</p>
    <p><strong>Email:</strong> {profile.email}</p>
    <button className={styles.editButton} onClick={onEdit}>Edit Profile</button>
  </div>
);

const ProfileEditForm: React.FC<{
  profile: IUserProfile;
  onSave: (updatedProfile: Partial<IUserProfile>) => void;
  onCancel: () => void
}> = ({ profile, onSave, onCancel }) => {
  const [formData, setFormData] = useState(profile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className={styles.profileForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="full_name">Full Name</label>
        <input
          id="full_name"
          name="full_name"
          value={formData.full_name || ''}
          onChange={handleChange}
          placeholder="Full Name"
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="marketing_opt_in">
          <input
            id="marketing_opt_in"
            type="checkbox"
            name="marketing_opt_in"
            checked={formData.marketing_opt_in}
            onChange={handleChange}
          />
          Opt-in to Marketing
        </label>
      </div>
      <div className={styles.formActions}>
        <button type="submit" className={styles.saveButton}>Save</button>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default withAuth(Dashboard);