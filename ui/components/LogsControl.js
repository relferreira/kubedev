import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Card from './Card';
import { successColor } from '../util/colors';
import refresh from '../assets/refresh.svg';

const CustomCard = styled(Card)`
  display: flex;
  align-items: center;
  position: absolute;
  width: 70%;
  height: 51px;
  bottom: 0;
  left: 50%;
  margin-left: -35%;
  padding: 16px;
  color: black;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
`;

const LogName = styled.span`
  flex: 1;
`;

const LogIndicator = styled.span`
  flex: 0 0 10px;
  height: 10px;
  border-radius: 50%;
  background: ${successColor};
`;

const LogTime = styled.span`
  margin-left: 6px;
  font-size: 12px;
`;

const LogRefresh = styled.img`
  margin-left: 16px;
  cursor: pointer;
`;

const LogsControl = ({ containers, onSelect, onRefresh }) => (
  <CustomCard>
    <select onChange={event => onSelect(event.target.value)}>
      {containers.map(container => (
        <option key={container}>{container}</option>
      ))}
    </select>
    <LogName>{name}</LogName>
    <LogIndicator />
    <LogTime>Real-time</LogTime>
    {/* <LogRefresh src={refresh} onClick={onRefresh} /> */}
  </CustomCard>
);

LogsControl.propTypes = {
  containers: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
  onRefresh: PropTypes.func
};

export default LogsControl;
