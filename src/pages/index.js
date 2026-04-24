import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

function Hero() {
  return (
    <header className={styles.hero}>
      <div className="container">
        <div className={styles.heroBadge}>Technical Writer · Docs-as-Code · API Documentation</div>
        <h1 className={styles.heroTitle}>
          Hi, I'm <span className={styles.heroAccent}>Leandro Gabriel</span>
        </h1>
        <p className={styles.heroSubtitle}>
          I turn complex systems into clear, developer-first documentation. 7+ years building
          API references, integration guides, and AI-assisted docs pipelines for enterprise
          teams in fintech, retail, and cybersecurity.
        </p>
        <div className={styles.ctaButtons}>
          <Link className={`${styles.btn} ${styles.btnPrimary}`} to="/docs">
            View Featured Project
          </Link>
          <Link
            className={`${styles.btn} ${styles.btnOutline}`}
            to="https://www.linkedin.com/in/leandro-gabriel-8aab31167/">
            Connect on LinkedIn
          </Link>
        </div>
      </div>
    </header>
  );
}

function Card({title, description, icon, to, external}) {
  return (
    <Link to={to} className={styles.card}>
      <div className={styles.cardIcon}>
        <i className={icon}></i>
      </div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>
      <div className={styles.cardArrow}>
        {external ? 'Visit' : 'Explore'} <i className="fas fa-arrow-right"></i>
      </div>
    </Link>
  );
}

function FeaturesGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Portfolio Highlights</h2>
          <p className={styles.sectionLead}>
            A curated set of documentation samples spanning developer APIs, hardware
            installation guides, AI-assisted content, and style governance.
          </p>
        </div>
        <div className={styles.cardGrid}>
          <Card
            title="EnergyGrid — Featured Project"
            description="An end-to-end documentation portal for a fictional utility platform — showcases information architecture, docs-as-code, and Docusaurus theming."
            icon="fas fa-star"
            to="/docs"
          />
          <Card
            title="Methodology — Google Style + Diátaxis"
            description="The two frameworks I specialize in: Google's Developer Documentation Style Guide for sentence-level rules, and Diátaxis for page-level content taxonomy."
            icon="fas fa-compass"
            to="/docs/methodology"
          />
          <Card
            title="Integration Guide"
            description="OAuth 2.0 / OIDC flow, CIS data sync, and bulk ingestion via SFTP / object storage — written for utility backend engineers."
            icon="fas fa-plug"
            to="/docs/integration-guide"
          />
          <Card
            title="API Reference (OpenAPI)"
            description="Interactive API docs auto-generated from OpenAPI specs using docusaurus-plugin-openapi-docs."
            icon="fas fa-code"
            to="/docs/api/powerbox-api"
          />
          <Card
            title="Hardware Install Guides"
            description="Consumer-friendly step-by-step guides for smart-meter hardware — QR codes, mobile pairing, and Wi-Fi provisioning."
            icon="fas fa-wifi"
            to="/docs/energy-bridge/energy-bridge-installation-guide-atlas-insight"
          />
          <Card
            title="BillSense AI — Support Docs"
            description="User guide and troubleshooting reference for an AI-powered bill analysis tool, written for customer support agents."
            icon="fas fa-brain"
            to="/docs/billwise-ai/overview"
          />
          <Card
            title="Writing Style Guide"
            description="Applied style guide built on Google Developer Style + Diátaxis — voice, tone, UX patterns, and a pre-publication checklist."
            icon="fas fa-book-open"
            to="/docs/writing-guideline"
          />
        </div>
      </div>
    </section>
  );
}

function AboutStrip() {
  return (
    <section className={styles.aboutStrip}>
      <div className={styles.container}>
        <div className={styles.aboutGrid}>
          <div className={styles.aboutItem}>
            <div className={styles.aboutNumber}>7+</div>
            <div className={styles.aboutLabel}>Years writing enterprise docs</div>
          </div>
          <div className={styles.aboutItem}>
            <div className={styles.aboutNumber}>75%</div>
            <div className={styles.aboutLabel}>Rework reduced via modular docs</div>
          </div>
          <div className={styles.aboutItem}>
            <div className={styles.aboutNumber}>4.6/5</div>
            <div className={styles.aboutLabel}>Dev documentation satisfaction</div>
          </div>
          <div className={styles.aboutItem}>
            <div className={styles.aboutNumber}>3</div>
            <div className={styles.aboutLabel}>Languages — PT · EN · ES</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description="Leandro Gabriel — Technical Writer building clear, developer-first documentation for enterprise teams.">
      <Hero />
      <main>
        <FeaturesGrid />
        <AboutStrip />
      </main>
    </Layout>
  );
}
