import React from 'react';
import {
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiFlyout
} from '@elastic/eui';

const CustomDialog = ({ title, isOpen, onDismiss, children, width }) => {
  return (
    isOpen && (
      <EuiFlyout
        ownFocus={true}
        onClose={onDismiss}
        initialFocus="[type=search]"
        style={{ minHeight: '365px' }}
      >
        <EuiModalHeader>
          <EuiModalHeaderTitle>
            <h1>{title}</h1>
          </EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>{children}</EuiModalBody>
      </EuiFlyout>
    )
  );
};

export default CustomDialog;
