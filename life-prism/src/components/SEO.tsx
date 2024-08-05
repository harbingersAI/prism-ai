import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
}

const defaultSEO = {
  siteName: 'Prism Mental Health',
  description: 'AI-powered mental health support and personalized insights for your well-being journey.',
  keywords: 'mental health, AI, therapy, well-being, mindfulness, self-care',
  ogImage: 'https://www.prismmentalhealth.com/og-image.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterSite: '@PrismMentalHealth',
};

const SEO: React.FC<SEOProps> = ({
  title,
  description = defaultSEO.description,
  keywords = defaultSEO.keywords,
  ogImage = defaultSEO.ogImage,
  ogType = defaultSEO.ogType,
  twitterCard = defaultSEO.twitterCard,
}) => {
  const router = useRouter();
  const fullTitle = title ? `${title} | ${defaultSEO.siteName}` : defaultSEO.siteName;
  const canonicalUrl = `https://www.prismmentalhealth.com${router.asPath}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={defaultSEO.siteName} />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={defaultSEO.twitterSite} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional tags for better SEO */}
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="theme-color" content="#000000" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/logo192.png" />
      <link rel="manifest" href="/manifest.json" />

      {/* Structured Data for Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "http://schema.org",
          "@type": "Organization",
          "name": defaultSEO.siteName,
          "url": "https://www.prismmentalhealth.com",
          "logo": "https://www.prismmentalhealth.com/logo.png",
          "sameAs": [
            "https://www.facebook.com/PrismMentalHealth",
            "https://www.twitter.com/PrismMentalHealth",
            "https://www.linkedin.com/company/prism-mental-health",
            "https://www.instagram.com/prismmentalhealth"
          ]
        })}
      </script>
    </Head>
  );
};

export default SEO;