import React from 'react';

import { Router } from '@reach/router';
import styled from '@emotion/styled';

const CustomRouter = styled(Router)`
  flex: 1;
  padding: 16px;
  overflow: auto;
  background: ${props => props.theme.background};
  color: ${props => props.theme.containerFont};

  h1 {
    font-size: 24px;
    margin-bottom: 16px;
  }
`;

export default CustomRouter;
