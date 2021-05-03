import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { EuiCard, EuiButton, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';

const EditControl = ({ confirm, loading, onDiff, onConfirm, onCancel }) => (
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
      <EuiFlexItem grow={true}>
        <p>{!loading ? 'Apply Configuration?' : 'Loading...'}</p>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        {!confirm ? (
          <EuiButton onClick={onDiff} disabled={loading}>
            save
          </EuiButton>
        ) : (
          <EuiFlexGroup>
            <EuiFlexItem grow={true}>
              <EuiButton color="danger" onClick={onCancel} disabled={loading}>
                cancel
              </EuiButton>
            </EuiFlexItem>
            <EuiFlexItem grow={true}>
              <EuiButton onClick={onConfirm} disabled={loading}>
                confirm
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        )}
      </EuiFlexItem>
    </EuiFlexGroup>
  </EuiCard>
);

EditControl.propTypes = {
  confirm: PropTypes.bool,
  loading: PropTypes.bool,
  onDiff: PropTypes.func,
  confirm: PropTypes.bool
};

EditControl.defaultProps = {
  confirm: false,
  loading: false
};

export default EditControl;
