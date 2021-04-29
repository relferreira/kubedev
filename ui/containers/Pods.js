import React, { useState, Fragment } from 'react';
import { EuiHealth, EuiBadge, formatDate } from '@elastic/eui';
import moment from 'moment';

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
      return 'secondary';
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
        type="pods"
        namespace={namespace}
        command="get pods"
        navigate={navigate}
        filterFields={['metadata.name', 'status.phase']}
        formatHeader={() => [
          { id: 'name', label: 'Name', sorted: true },
          { id: 'ready', label: 'Ready', align: 'center' },
          {
            id: 'status',
            label: 'Status',
            align: 'center',
            render: status => (
              <EuiBadge color={getPodState(status)}>{status}</EuiBadge>
            )
          },
          { id: 'restarts', label: 'Restarts', align: 'center' },
          {
            id: 'age',
            label: 'Age',
            align: 'right',
            sorted: true,
            type: 'date'
          }
        ]}
        formatItems={items =>
          items.map(({ metadata, status, spec }) => ({
            name: metadata.name,
            ready: getContainersReady(spec, status),
            status: status.phase,
            restarts: getContainersRestarts(status),
            age: metadata.creationTimestamp
          }))
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
