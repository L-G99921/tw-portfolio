import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import FeedbackWidget from '@site/src/components/FeedbackWidget';
import { useLocation } from '@docusaurus/router';

export default function FooterWrapper(props) {
  const { pathname } = useLocation();
  const isApiPage = pathname.includes('/api/');

  return (
    <>
      <Footer {...props} />
      {!isApiPage && <FeedbackWidget />}
    </>
  );
}
