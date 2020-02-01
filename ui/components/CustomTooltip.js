import React from 'react';
import styled from '@emotion/styled';
import Tooltip from '@reach/tooltip';

const CustomTooltip = styled(Tooltip)`
  background: hsla(0, 0%, 0%, 0.75);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5em 1em;
`;

export default CustomTooltip;
