import React, { useState, Fragment } from 'react';
import { EuiHealth } from '@elastic/eui';

import { useConfigContext } from '../state-management/config-management';
import {
  getContainersReady,
  getContainersRestarts
} from '../state-management/pod-management';
import NewTableInfo from './NewTableInfo';

export function getPodState(state) {
  switch (state) {
    case 'Succeeded':
      return 'primary';
    case 'Running':
      return 'success';
    case 'Failed':
      return 'danger';
    case 'Pending':
      return 'warning';
    case 'Unknown':
      return 'subdued';
    default:
      return 'subdued';
  }
}

export default function Pods({ namespace, navigate }) {
  const { config } = useConfigContext();

  return (
    <Fragment>
      <NewTableInfo
        title="Pods"
        namespace={namespace}
        command="get pods"
        navigate={navigate}
        filterFields={['metadata.name', 'status.phase']}
        formatHeader={() => [
          'Name',
          { label: 'Ready', align: 'center' },
          { label: 'Status', align: 'center' },
          { label: 'Restarts', align: 'center' },
          { label: 'Age', align: 'right' }
        ]}
        formatItems={items =>
          items.map(({ metadata, status, spec }) => [
            metadata.name,
            getContainersReady(spec, status),
            <EuiHealth color={getPodState(status.phase)}>
              {status.phase}
            </EuiHealth>,
            getContainersRestarts(status),
            metadata.creationTimestamp
          ])
        }
        dialogItems={[
          { value: 'Logs', type: 'pods', href: 'logs' },
          { value: 'Edit', type: 'pods', href: 'edit' },
          // { value: 'Info', type: 'pods', href: 'get' },
          { value: 'Describe', type: 'pods', href: 'describe' }
        ]}
      />
    </Fragment>
  );
}
