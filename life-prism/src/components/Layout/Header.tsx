import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import styles from '@/styles/components/layout/Header.module.scss';
import { getCookie } from '@/utils/cookieHandler';
import { useAuth } from '@/hooks/useAuth';



const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const isAuthenticated = !!getCookie("lifeprsm");
  const { logout } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = isAuthenticated
    ? [
        { name: 'Home', path: '/' },
        { name: 'New Session', path: '/chat' },
        { name: 'Session History', path: '/sessions' },
        { name: 'Psychometry', path: '/psychometryProfile' },
        { name: 'Lifeline', path: '/lifeline' },
      ]
    : [
        { name: 'Home', path: '/' },
        { name: 'Features', path: '/features' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'Lifeline', path: '/lifeline' },
      ];

  const headerClass = `${styles.header} ${isScrolled ? styles.scrolled : ''}`;

  const mobileMenuVariants = {
    closed: { opacity: 0, x: '-100%' },
    open: { opacity: 1, x: 0 },
  };

  return (
    <header className={headerClass}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <motion.img 
            src="/logo.png" 
            alt="Prism Logo" 
            width={40} 
            height={40}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
          <span className={styles.logoText}>Prism</span>
        </Link>

        <nav className={styles.desktopNav}>
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.path}
              className={`${styles.navItem} ${router.pathname === item.path ? styles.active : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          {isAuthenticated ? (
            <>
              <Link href="/profile" className={styles.loginButton}>
                <FaUser />
                <span>Profile</span>
              </Link>
              <button onClick={handleLogout} className={styles.signupButton}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.loginButton}>
                <FaUser />
                <span>Log In</span>
              </Link>
              <Link href="/signup" className={styles.signupButton}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button 
          className={styles.mobileMenuButton} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav 
              className={styles.mobileNav}
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              transition={{ duration: 0.3 }}
            >
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.path}
                  className={`${styles.mobileNavItem} ${router.pathname === item.path ? styles.active : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link href="/profile" className={styles.mobileLoginButton} onClick={() => setIsMobileMenuOpen(false)}>
                    Profile
                  </Link>
                  <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className={styles.mobileSignupButton}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className={styles.mobileLoginButton} onClick={() => setIsMobileMenuOpen(false)}>
                    Log In
                  </Link>
                  <Link href="/signup" className={styles.mobileSignupButton} onClick={() => setIsMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;