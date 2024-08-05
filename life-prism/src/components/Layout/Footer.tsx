import Link from 'next/link';
import Image from 'next/image';
import { FaTwitter, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import styles from '@/styles/components/layout/Footer.module.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.branding}>
            <Link href="/" className={styles.logo}>
              <Image src="/logo.png" alt="Prism Logo" width={40} height={40} />
              <span className={styles.logoText}>Prism</span>
            </Link>
            <p className={styles.tagline}>Refracting chaos into clarity</p>
          </div>
          <nav className={styles.nav}>
            <div className={styles.navColumn}>
              <h3>Product</h3>
              <ul>
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
              </ul>
            </div>
            <div className={styles.navColumn}>
              <h3>Company</h3>
              <ul>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className={styles.navColumn}>
              <h3>Legal</h3>
              <ul>
                <li><Link href="/terms">Terms</Link></li>
                <li><Link href="/privacy">Privacy</Link></li>
              </ul>
            </div>
          </nav>
        </div>
        <div className={styles.bottom}>
          <p className={styles.copyright}>&copy; {currentYear} Prism Mental Health. All rights reserved.</p>
          <p className={styles.hackathonInfo}>This project has been built as part of the Falcon Hackathon. The version you are seeing is in alpha stage.</p>
          <div className={styles.social}>
            <a href="https://twitter.com/PrismMentalHealth" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://github.com/PrismMentalHealth" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub />
            </a>
            <a href="https://linkedin.com/company/PrismMentalHealth" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;