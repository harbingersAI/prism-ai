import React, { useState, useEffect } from 'react';
import styles from '@/styles/pages/Lifeline.module.scss';
import suicideHotlines from '@/data/suicide-hotlines.json';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout/Layout';

// Define a type for hotline information
interface HotlineInfo {
  phones: string[];
  description: string;
}

const Lifeline: React.FC = () => {
  const [country, setCountry] = useState<string | null>(null);
  const [hotlines, setHotlines] = useState<HotlineInfo[]>([]);
  const [searchCountry, setSearchCountry] = useState<string>('');

  // Update hotlines based on the selected country
  const updateHotlines = (selectedCountry: string) => {
    const countryHotlines = suicideHotlines[selectedCountry as keyof typeof suicideHotlines];
    if (countryHotlines) {
      setHotlines(countryHotlines.parsed_batches);
    } else {
      setHotlines([]);
    }
  };

  // Handle manual search for a different country's hotlines
  const handleSearchCountry = () => {
    setCountry(searchCountry);
    updateHotlines(searchCountry);
    setSearchCountry('');
  };

  return (<><Layout>
    <div className={styles.lifelineContainer}>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.title}
      >
        Lifeline
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className={styles.subtitle}
      >
        Immediate support and resources when you need them most.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className={styles.messageBox}
      >
        <p>It&apos;s okay to ask for help. It&apos;s never too late.</p>
        <p>Take a deep breath. You&apos;re not alone in this.</p>
      </motion.div>
      <AnimatePresence mode="wait">
        {country && (
          <motion.div
            key={country}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className={styles.hotlineCard}
          >
            <h2>{country} Hotlines</h2>
            {hotlines.length > 0 ? (
              hotlines.map((hotline, index) => (
                <div key={index} className={styles.hotlineInfo}>
                  <p>{hotline.description}</p>
                  <ul>
                    {hotline.phones.map((phone, phoneIndex) => (
                      <li key={phoneIndex}>
                        <a href={phone}>{phone.replace('tel:', '')}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p>No hotline information available for this country.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={searchCountry}
          onChange={(e) => setSearchCountry(e.target.value)}
          placeholder="Enter country name"
          className={styles.searchInput}
        />
        <button onClick={handleSearchCountry} className={styles.searchButton}>
          Fetch a Country&apos;s Suicide Hotline
        </button>
      </div>
    </div></Layout></>
  );
};

export default Lifeline;
