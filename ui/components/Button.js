import React from 'react';
import styled from '@emotion/styled';
import { primary, fontColorWhite, errorColor } from '../util/colors';

function getBackground(type) {
  switch (type) {
    case 'primary':
      return primary;
    case 'error':
      return errorColor;
    default:
      return primary;
  }
}

const Button = styled.button`
  padding: 5px 10px;
  background: ${props => getBackground(props.type)};
  color: ${fontColorWhite};
  border: none;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  cursor: pointer;
`;

export default Button;
