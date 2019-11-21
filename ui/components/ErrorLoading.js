import React from 'react';
import styled from '@emotion/styled';

const ErrorLoadingContainer = styled.div`
  flex: 1;
  height: 100%;
  background: ${props => props.theme.background};
  padding: 16px;
  color: ${props => props.theme.containerFont};
`;

const ErrorLoading = () => (
  <ErrorLoadingContainer>Something exploded :(</ErrorLoadingContainer>
);

export default ErrorLoading;
