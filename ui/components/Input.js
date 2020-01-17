import React from 'react';
import styled from '@emotion/styled';
import { controllerBorderHighlight } from '../util/colors';

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.controllerBorder};
  background: transparent;
  color: ${props => props.theme.controllerColor};
  border-radius: 3px;
  font-size: 12px;
  outline: none;

  &:disabled {
    opacity: 0.3;
  }

  &:focus {
    border-color: ${controllerBorderHighlight};
  }
`;

export default Input;
