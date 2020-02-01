import React from 'react';
import styled from '@emotion/styled';
import { Dialog, DialogOverlay, DialogContent } from '@reach/dialog';

const StyledDialog = styled(Dialog)`
  width: ${props => props.width};
  background: ${props => props.theme.background};
  color: ${props => props.theme.containerFont};
`;

const DialogHeader = styled.div`
  display: flex;

  span {
    flex: 1;
  }

  button {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: ${props => props.theme.containerFont};
  }
`;

const DialogContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
`;

const CustomDialog = ({ title, isOpen, onDismiss, children, width }) => (
  <StyledDialog
    isOpen={isOpen}
    onDismiss={onDismiss}
    width={width}
    aria-label="Modal content"
  >
    <DialogHeader>
      <span>{title}</span>
      <button className="close-button" onClick={onDismiss} tabIndex="-1">
        <span aria-hidden>×</span>
      </button>
    </DialogHeader>
    <DialogContainer>{children}</DialogContainer>
  </StyledDialog>
);

export default CustomDialog;
