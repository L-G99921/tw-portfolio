import React from 'react';
import ApiExplorer from '@theme-original/ApiExplorer';

// Wraps the request panel with a note on how the sandbox works.
export default function ApiExplorerWrapper(props) {
  return (
    <>
      <p className="lg-sandbox-note">
        <strong>Live sandbox.</strong> Requests run in your browser against a simulated server
        built from this OpenAPI spec. Use any value as the bearer token. Nothing is sent over the
        network.
      </p>
      <ApiExplorer {...props} />
    </>
  );
}
