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
  min-width: 64px;
  height: 36px;
  padding: 0px 10px;
  background: transparent;
  color: ${props => getBackground(props.type)};
  border: 1px solid ${props => getBackground(props.type)};
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
`;

export default Button;
