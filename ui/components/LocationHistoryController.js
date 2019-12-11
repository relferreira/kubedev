import React from 'react';
import styled from '@emotion/styled';

const HistoryButtons = styled.div`
  display: flex;
  border-radius: 3px;
  overflow: hidden;

  span {
    width: 1px;
    height: 100%;
    background: ${props => props.theme.tableBorder};
  }
`;

const HistoryButton = styled.button`
  background: transparent;
  border: none;
  padding: 0 5px;
  cursor: pointer;
  background: ${props => props.theme.controllerBackground};
  fill: ${props => props.theme.containerFont};
  outline: none;
`;

const ReversedHistoryButton = styled(HistoryButton)`
  svg {
    transform: rotate(180deg);
  }
`;

const LocationHistoryController = () => (
  <HistoryButtons>
    <ReversedHistoryButton onClick={() => window.history.back()}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
      >
        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        <path fill="none" d="M0 0h24v24H0V0z" />
      </svg>
    </ReversedHistoryButton>
    <span />
    <HistoryButton onClick={() => window.history.forward()}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
      >
        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        <path fill="none" d="M0 0h24v24H0V0z" />
      </svg>
    </HistoryButton>
  </HistoryButtons>
);

export default LocationHistoryController;
