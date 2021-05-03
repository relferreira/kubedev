import React from 'react';
import PropTypes from 'prop-types';

import {
  EuiSelect,
  EuiCard,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem
} from '@elastic/eui';

const LogsControl = ({
  selected,
  containers,
  following,
  onSelect,
  onFollow
}) => (
  <EuiCard
    layout="horizontal"
    paddingSize="s"
    style={{
      position: 'absolute',
      width: '70%',
      bottom: '0',
      left: '50%',
      marginLeft: '-35%',
      borderBottomLeftRadius: '0px',
      borderBottomRightRadius: '0px'
    }}
  >
    <EuiFlexGroup alignItems="center">
      <EuiFlexItem grow={false}>
        <EuiSelect
          value={selected}
          onChange={event => onSelect(event.target.value)}
          options={containers.map(container => ({
            value: container,
            text: container
          }))}
        >
          {containers.map(container => (
            <option key={container}>{container}</option>
          ))}
        </EuiSelect>
      </EuiFlexItem>
      <EuiFlexItem flex="1">
        <span style={{ flex: 1 }}>{name}</span>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <div onClick={onFollow}>
          <EuiButtonIcon
            iconType={following ? 'pause' : 'play'}
            color={following ? 'danger' : 'success'}
            size="m"
            aria-label="Folow logs"
          />
        </div>
      </EuiFlexItem>
    </EuiFlexGroup>
  </EuiCard>
);

LogsControl.propTypes = {
  containers: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
  onRefresh: PropTypes.func
};

export default LogsControl;
