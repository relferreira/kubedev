import React from 'react';
import styled from '@emotion/styled';
import { controllerBorderHighlight } from '../util/colors';

const Input = styled.input`
  padding: 8px 12px;
  border: 2px solid ${props => props.theme.controllerBorder};
  background: ${props => props.theme.controllerBackground};
  color: ${props => props.theme.controllerColor};
  border-radius: 5px;
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
