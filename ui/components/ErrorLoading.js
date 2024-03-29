import React from 'react';

import { EuiErrorBoundary } from '@elastic/eui';

const BadComponent = () => {
  throw new Error(
    "I'm here to kick butt and chew bubblegum. And I'm all out of gum."
  );
};

export default () => (
  <EuiErrorBoundary>
    <BadComponent />
  </EuiErrorBoundary>
);
