import React from 'react';
import { EuiPortal, EuiProgress } from '@elastic/eui';

const ProgressBar = ({ porcentage = 20 }) => (
  <EuiPortal>
    <EuiProgress size="xs" color="primary" position="fixed" />
  </EuiPortal>
);

export default ProgressBar;
