import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Card from './Card';
import { successColor, errorColor } from '../util/colors';
import Select from './Select';

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
  color: ${props => props.theme.containerFont};
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
`;

const LogName = styled.span`
  flex: 1;
`;

const LogActions = styled.a`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
`;

const LogIndicator = styled.span`
  flex: 0 0 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => (props.following ? errorColor : successColor)};
`;

const LogTime = styled.span`
  margin-left: 6px;
  font-size: 12px;
`;

const LogsControl = ({
  selected,
  containers,
  following,
  onSelect,
  onFollow
}) => (
  <CustomCard>
    <Select value={selected} onChange={event => onSelect(event.target.value)}>
      {containers.map(container => (
        <option key={container}>{container}</option>
      ))}
    </Select>
    <LogName>{name}</LogName>
    <LogActions onClick={onFollow}>
      <LogIndicator following={following} />
      <LogTime>{following ? 'Stop following' : 'Click to follow'}</LogTime>
    </LogActions>
    {/* //TODO */}
    {/* <LogRefresh src={refresh} onClick={onRefresh} /> */}
  </CustomCard>
);

LogsControl.propTypes = {
  containers: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
  onRefresh: PropTypes.func
};

export default LogsControl;
