import React, {useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

const LINKEDIN = 'https://www.linkedin.com/in/leandro-gabriel-8aab31167/';

/* ---------- Live request card ---------- */

// txid must be 26 to 35 alphanumeric characters (see the spec).
const newTxid = () => ('LGDEMO' + Date.now().toString(36) + 'a1b2c3d4e5f6g7h8').slice(0, 32);
const REQUEST_BODY = {
  calendario: {expiracao: 3600},
  devedor: {cpf: '12345678909', nome: 'Maria Silva'},
  valor: {original: '150.00'},
  chave: 'merchant@example.com',
};

function LiveRequest() {
  const [state, setState] = useState({status: 'idle'});

  async function run() {
    setState({status: 'loading'});
    try {
      if ('serviceWorker' in navigator) {
        await Promise.race([navigator.serviceWorker.ready, new Promise((r) => setTimeout(r, 3000))]);
      }
      const url = `https://sandbox.instant-payments.example/v2/cob/${newTxid()}`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', Authorization: 'Bearer portfolio-demo'},
        body: JSON.stringify(REQUEST_BODY),
      });
      const json = await res.json();
      setState({status: 'done', code: res.status, json});
    } catch {
      setState({status: 'error'});
    }
  }

  return (
    <div className={styles.live}>
      <div className={styles.liveBar}>
        <span className={styles.method}>PUT</span>
        <code className={styles.livePath}>/v2/cob/{'{txid}'}</code>
        <button type="button" className={styles.runBtn} onClick={run} disabled={state.status === 'loading'}>
          {state.status === 'loading' ? 'Sending…' : state.status === 'done' ? 'Send again' : 'Send request'}
        </button>
      </div>
      <pre className={styles.liveCode}>
        {state.status === 'done' ? (
          <>
            <span className={state.code < 300 ? styles.liveStatus : styles.liveStatusError}>HTTP {state.code}</span>
            {'\n'}
            {JSON.stringify(
              state.code < 300
                ? {txid: state.json.txid, status: state.json.status, revisao: state.json.revisao, valor: state.json.valor, loc: state.json.loc}
                : state.json,
              null,
              2,
            )}
          </>
        ) : state.status === 'error' ? (
          'The sandbox could not start in this browser. Open the API reference to see the full examples.'
        ) : (
          JSON.stringify(REQUEST_BODY, null, 2)
        )}
      </pre>
      <p className={styles.liveNote}>
        Creates a PIX charge in the in-browser sandbox.{' '}
        <Link to="/docs/api/pix-api/create-charge">Open the full reference</Link>
      </p>
    </div>
  );
}

/* ---------- Sections ---------- */

function Hero() {
  return (
    <header className={styles.hero}>
      <div className={`container ${styles.heroGrid}`}>
        <div>
          <p className={styles.eyebrow}>Senior Technical Writer · João Pessoa, Brazil</p>
          <h1 className={styles.heroTitle}>Documentation for APIs, payments, and data platforms</h1>
          <p className={styles.heroLead}>
            I'm Leandro Gabriel. For 6+ years I've written API references, integration guides, and
            support docs for Itaú (the PIX instant-payments APIs), Sephora LATAM, L'Oréal France, and
            Crane Worldwide. This site is my portfolio, built the way I build docs: in Git, linted in
            CI, and generated from OpenAPI where it can be.
          </p>
          <div className={styles.ctas}>
            <Link className={`${styles.btn} ${styles.btnPrimary}`} to="/docs">
              See the featured project
            </Link>
            <Link className={`${styles.btn} ${styles.btnGhost}`} to={LINKEDIN}>
              LinkedIn profile
            </Link>
          </div>
        </div>
        <LiveRequest />
      </div>
    </header>
  );
}

const SAMPLES = [
  {type: 'Tutorial', title: 'Your first EnergyGrid integration', text: 'From sandbox credentials to a synced customer and a bound DataBridge device, in about 30 minutes.', to: '/docs/tutorial-first-integration'},
  {type: 'Tutorial', title: 'Send your first PIX payment', text: 'Get a token, create a charge, receive the webhook, and reconcile the payment.', to: '/docs/pix/tutorial-first-payment'},
  {type: 'How-to', title: 'Handle PIX webhooks', text: 'Signature checks, fast acknowledgment, idempotency, and recovery after an outage.', to: '/docs/pix/how-to-handle-webhooks'},
  {type: 'How-to', title: 'PowerBox and BillSense AI integration guide', text: 'OAuth 2.0, customer sync, and bulk ingestion over SFTP for utility backend teams.', to: '/docs/integration-guide'},
  {type: 'How-to', title: 'Hardware install guides', text: 'Step-by-step setup for smart-meter hardware, written for people at home.', to: '/docs/databridge/databridge-installation-guide-atlas-insight'},
  {type: 'Reference', title: 'PIX API reference', text: 'Generated from OpenAPI, with a working sandbox on every endpoint.', to: '/docs/api/pix-api/instant-payments-api-pix-sample'},
  {type: 'Reference', title: 'Data dictionary', text: 'Data sources, dependencies, and storage for three types of utility integration.', to: '/docs/data-dictionary'},
  {type: 'Explanation', title: 'About PIX', text: "How Brazil's instant-payments rail works and why it's designed that way.", to: '/docs/pix/about-pix'},
  {type: 'Support', title: 'BillSense AI user guide', text: 'Overview, setup, and troubleshooting for an AI tool that explains energy bills.', to: '/docs/billsense-ai/overview'},
];

function Samples() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionHead}>
          <h2>Work samples</h2>
          <p>
            Most samples belong to <strong>EnergyGrid</strong>, a fictional utility platform documented
            end to end for three audiences: backend engineers, people installing hardware at home, and
            support agents. The PIX set is modeled on the public PIX standard and anonymized. Each page
            is one Diátaxis type, labeled below.
          </p>
        </div>
        <ul className={styles.samples}>
          {SAMPLES.map((s) => (
            <li key={s.to}>
              <Link to={s.to} className={styles.sample}>
                <span className={`${styles.type} ${styles['type' + s.type.replace('-', '')]}`}>{s.type}</span>
                <span className={styles.sampleTitle}>{s.title}</span>
                <span className={styles.sampleText}>{s.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Results() {
  const items = [
    {n: '6+', l: 'years writing enterprise documentation'},
    {n: '75%', l: 'less rework after moving Sephora LATAM docs to modular content'},
    {n: '3.8 → 4.6', l: 'developer satisfaction with the docs at Itaú, out of 5, in six months'},
    {n: 'PT · EN · ES', l: 'languages I write and review in'},
  ];
  return (
    <section className={`${styles.section} ${styles.sectionAlt}`}>
      <div className="container">
        <ul className={styles.results}>
          {items.map((i) => (
            <li key={i.n}>
              <strong>{i.n}</strong>
              <span>{i.l}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Method() {
  const items = [
    {title: 'Google developer style', text: 'Sentence-level rules: second person, active voice, present tense, no filler.', to: '/docs/methodology'},
    {title: 'Diátaxis', text: 'Page-level structure: every page is a tutorial, a how-to, a reference, or an explanation.', to: '/docs/adr/003-diataxis-as-page-taxonomy'},
    {title: 'Vale in CI', text: 'Style rules run on every pull request, and an error blocks the merge.', to: '/docs/adr/004-vale-fail-on-error'},
    {title: 'OpenAPI as the source', text: 'The reference pages and the sandbox both come from the same spec file.', to: '/docs/adr/005-openapi-as-source-of-truth'},
  ];
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionHead}>
          <h2>How I work</h2>
          <p>The decisions behind this site are written down as architecture decision records.</p>
        </div>
        <ul className={styles.principles}>
          {items.map((i) => (
            <li key={i.title}>
              <Link to={i.to}>
                <strong>{i.title}</strong>
                <span>{i.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className={styles.contact}>
      <div className={`container ${styles.contactInner}`}>
        <div>
          <h2>Get in touch</h2>
          <p>Email or LinkedIn. I write and review in English, Portuguese, and Spanish.</p>
        </div>
        <div className={styles.ctas}>
          <a className={`${styles.btn} ${styles.btnPrimary}`} href="mailto:lgos99921@gmail.com">
            lgos99921@gmail.com
          </a>
          <Link className={`${styles.btn} ${styles.btnGhost}`} to={LINKEDIN}>
            LinkedIn
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout
      title="Senior Technical Writer"
      description="Leandro Gabriel, senior technical writer. API references, integration guides, and docs-as-code for fintech, retail, and data platforms.">
      <Hero />
      <main>
        <Samples />
        <Results />
        <Method />
        <Contact />
      </main>
    </Layout>
  );
}
