import React from 'react';
import styled from '@emotion/styled';

const Input = styled.input`
  padding: 5px 10px;
  border: 1px solid ${props => props.theme.controllerBorder};
  background: ${props => props.theme.controllerBackground};
  color: ${props => props.theme.controllerColor};
  border-radius: 5px;
  font-size: 12px;
`;

export default Input;
