import React from 'react';
import styled from '@emotion/styled';

import {
  successColor,
  errorColor,
  warningColor,
  neutralColor
} from '../util/colors';

const PodStatus = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: ${props => {
    switch (props.state) {
      case 'Running' || 'Succeeded':
        return successColor;
      case 'Failed':
        return errorColor;
      case 'Pending':
        return warningColor;
      case 'Unknown':
        return neutralColor;
      default:
        return successColor;
    }
  }};
`;

export default PodStatus;
