import React from 'react';
import styled from '@emotion/styled';
import { Dialog, DialogOverlay, DialogContent } from '@reach/dialog';
import { useSpring, animated, useTransition } from 'react-spring';

const AnimatedDialogContent = animated(DialogContent);
const AnimatedDialogOverlay = animated(DialogOverlay);

const StyledDialog = styled(AnimatedDialogContent)`
  width: ${props => props.width};
  background: ${props => props.theme.header};
  color: ${props => props.theme.containerFont};
  border-radius: 5px;
  padding: 0px;
  overflow: hidden;
`;

const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.controllerBorder};

  span {
    flex: 1;
  }

  button {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 20px;
    color: ${props => props.theme.containerFont};
  }
`;

const DialogContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const CustomDialog = ({ title, isOpen, onDismiss, children, width }) => {
  const transitions = useTransition(isOpen, null, {
    from: { opacity: 0, y: 50 },
    enter: {
      opacity: 1,
      y: 0,
      boxShadow: '0px 10px 20px 0px rgba(0,0,0,0.4)'
    },
    leave: { opacity: 0, y: 50 },
    config: { tension: 250 }
  });
  return transitions.map(
    ({ item, key, props: styles }) =>
      item && (
        <AnimatedDialogOverlay
          key={key}
          style={{ background: 'transparent', opacity: styles.opacity }}
          onDismiss={onDismiss}
        >
          <StyledDialog
            style={styles}
            width={width}
            aria-label="Dialog content"
          >
            <DialogHeader>
              <span>{title}</span>
              {/* <button
                className="close-button"
                onClick={onDismiss}
                tabIndex="-1"
              >
                <span aria-hidden>×</span>
              </button> */}
            </DialogHeader>
            <DialogContainer>{children}</DialogContainer>
          </StyledDialog>
        </AnimatedDialogOverlay>
      )
  );
};

export default CustomDialog;
