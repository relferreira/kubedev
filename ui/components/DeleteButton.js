import React, { Fragment, useState, Children } from 'react';
import styled from '@emotion/styled';

import Dialog from './Dialog';
import Button from './Button';

const DialogButtons = styled.div`
  display: flex;
  justify-content: flex-end;

  button {
    margin-left: 16px;
  }
`;

export default function DeleteButton({ name, children, onClick }) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <Fragment>
      <Button type="error" onClick={() => setShowDialog(true)}>
        {children}
      </Button>
      <Dialog
        isOpen={showDialog}
        onDismiss={() => setShowDialog(false)}
        title={`Delete ${name}?`}
        width="400px"
      >
        <DialogButtons>
          <Button type="error" onClick={() => setShowDialog(false)}>
            NO
          </Button>
          <Button onClick={onClick}>YES</Button>
        </DialogButtons>
      </Dialog>
    </Fragment>
  );
}
