import React from 'react';
import styled from '@emotion/styled';

const ProgressContainer = styled.div`
  position: fixed;
  width: 100%;
  height: 3px;
  top: 60px;
  left: 0;
  background: ${props => props.theme.loadingContainer};
`;

const ProgressIndicator = styled.div`
  position: absolute;
  width: ${props => `${props.porcentage}%`};
  height: 100%;
  left: 0;
  background: ${props => props.theme.loadingIndicator};
  animation-duration: 2.5s;
  animation-name: slidein;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  @keyframes slidein {
    from {
      opacity: 0.5;
      left: -${props => `${props.porcentage}%`};
    }

    to {
      opacity: 1;
      left: calc(100% + ${props => `${props.porcentage}%`});
    }
  }
`;

const ProgressBar = ({ porcentage = 20 }) => (
  <ProgressContainer>
    <ProgressIndicator porcentage={porcentage} />
  </ProgressContainer>
);

export default ProgressBar;
