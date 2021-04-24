import React from 'react';
import ProgressBar from './ProgressBar';
import { EuiLoadingContent } from '@elastic/eui';

const RouterLoading = () => (
  <div>
    <EuiLoadingContent lines={6} />
    <ProgressBar />
  </div>
);

export default RouterLoading;
