import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './index.module.css';

function Hero() {
  const logoUrl = useBaseUrl('/img/energygrid-logo.svg');
  return (
    <header className={styles.hero}>
      <div className="container">
        <img
          src={logoUrl}
          alt="EnergyGrid"
          className={styles.heroLogo}
        />
        <div className={styles.ctaButtons}>
          <Link className={`${styles.btn} ${styles.btnPrimary}`} to="/docs/integration-guide">
            Get Started
          </Link>
          <Link className={`${styles.btn} ${styles.btnOutline}`} to="/docs/api/powerbox-api">
            View API Reference
          </Link>
        </div>
      </div>
    </header>
  );
}

function Card({title, description, icon, to}) {
  return (
    <Link to={to} className={styles.card}>
      <div className={styles.cardIcon}>
        <i className={icon}></i>
      </div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>
      <div className={styles.cardArrow}>
        Learn more <i className="fas fa-arrow-right"></i>
      </div>
    </Link>
  );
}

function FeaturesGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.cardGrid}>
          <Card
            title="Integration Guide"
            description="Comprehensive guides to integrate your utility backend systems with the EnergyGrid Platform."
            icon="fas fa-plug"
            to="/docs/integration-guide"
          />
          <Card
            title="DataBridge"
            description="Technical specifications, installation guides, and troubleshooting for the DataBridge hardware."
            icon="fas fa-wifi"
            to="/docs/energy-bridge/energy-bridge-installation-guide-atlas-insight"
          />
          <Card
            title="BillSense AI"
            description="Leverage our advanced AI to provide personalized bill insights and disaggregation."
            icon="fas fa-brain"
            to="/docs/integration-guide#step-4-bulk-data-ingestion-required-for-billsense"
          />
          <Card
            title="API Reference"
            description="Explore the complete PowerBox API documentation, endpoints, and schemas."
            icon="fas fa-code"
            to="/docs/api/powerbox-api"
          />
          <Card
            title="Utility Portal"
            description="Manage customer accounts, view analytics, and configure settings."
            icon="fas fa-chart-line"
            to="/docs"
          />
          <Card
            title="Resources & Support"
            description="Access marketing assets, FAQs, and contact our support team."
            icon="fas fa-book-open"
            to="/docs"
          />
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Home`}
      description="EnergyGrid Technical Documentation">
      <Hero />
      <main>
        <FeaturesGrid />
      </main>
    </Layout>
  );
}