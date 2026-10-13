import React, { useState } from 'react';
import { useLocation } from '@docusaurus/router';
import styles from './styles.module.css';

export default function FeedbackWidget() {
  const [voted, setVoted] = useState(null);
  const { pathname } = useLocation();

  const handleVote = (helpful) => {
    setVoted(helpful ? 'yes' : 'no');

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_feedback', {
        event_category: 'docs',
        event_label: pathname,
        value: helpful ? 1 : 0,
      });
    }
  };

  return (
    <div className={styles.feedbackWidget}>
      {voted === null ? (
        <div className={styles.prompt}>
          <span className={styles.question}>Was this page helpful?</span>
          <div className={styles.buttons}>
            <button
              className={`${styles.button} ${styles.yes}`}
              onClick={() => handleVote(true)}
              aria-label="Yes, this page was helpful"
            >
              Yes
            </button>
            <button
              className={`${styles.button} ${styles.no}`}
              onClick={() => handleVote(false)}
              aria-label="No, this page was not helpful"
            >
              No
            </button>
          </div>
        </div>
      ) : (
        <p className={styles.thanks} role="status">
          Thanks. {voted === 'yes' ? 'Glad it helped.' : 'If something was missing, email me at lgos99921@gmail.com.'}
        </p>
      )}
    </div>
  );
}
