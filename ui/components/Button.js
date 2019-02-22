import React from 'react';
import styled from '@emotion/styled';
import { primary, fontColorWhite } from '../util/colors';

const Button = styled.button`
  padding: 5px 10px;
  background: ${primary};
  color: ${fontColorWhite};
  border: none;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  cursor: pointer;
`;

export default Button;
