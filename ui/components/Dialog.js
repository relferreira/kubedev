import React from 'react';
import {
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody
} from '@elastic/eui';

const CustomDialog = ({ title, isOpen, onDismiss, children, width }) => {
  return (
    isOpen && (
      <EuiModal
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
      </EuiModal>
    )
  );
};

export default CustomDialog;
