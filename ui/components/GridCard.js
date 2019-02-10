import React from 'react';
import styled from '@emotion/styled';

import Card from './Card';

const GridCard = styled(Card)`
  display: flex;
  align-items: center;
  padding: 16px;
  margin-bottom: 16px;

  grid-column: span 12;
  @media screen and (min-width: 720px) {
    grid-column: span 6;
    margin: 16px;
  }
`;

export default GridCard;
