import React from 'react';
import styled from '@emotion/styled';

const Card = styled.div`
  background: ${props => props.theme.cardBackground};
  border-radius: 3px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
`;

export default Card;
