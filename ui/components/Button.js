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
  background: transparent;
  color: ${props => getBackground(props.type)};
  border: 1px solid ${props => getBackground(props.type)};
  border-radius: 3px;
  cursor: pointer;
`;

export default Button;
