import React from 'react';
import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';

const LocationHistoryController = () => {
  const handleForward = () => window.history.forward();

  const handleBackward = () => window.history.back();

  return (
    <EuiFlexGroup
      alignItems="center"
      justifyContent="flexEnd"
      gutterSize="none"
    >
      <EuiFlexItem onClick={handleBackward} aria-label="Go Back" grow={false}>
        <EuiButtonIcon color="text" iconType="arrowLeft" />
      </EuiFlexItem>

      <EuiFlexItem onClick={handleForward} aria-label="Go Forward" grow={false}>
        <EuiButtonIcon color="text" iconType="arrowRight" />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

export default LocationHistoryController;
