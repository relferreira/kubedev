import React from 'react';
import styled from '@emotion/styled';
import ProgressBar from './ProgressBar';

const RouterLoadingContainer = styled.div`
  flex: 1;
  height: 100%;
  background: ${props => props.theme.background};
  padding: 16px;
  color: ${props => props.theme.containerFont};
`;

const RouterLoading = () => (
  <RouterLoadingContainer>
    Loading...
    <ProgressBar />
  </RouterLoadingContainer>
);

export default RouterLoading;
