import React from 'react';

import { getPublicIP, getPorts } from '../state-management/services-management';
import NewTableInfo from './NewTableInfo';

export default function Services({ namespace, navigate }) {
  return (
    <NewTableInfo
      title="Services"
      namespace={namespace}
      command="get services"
      navigate={navigate}
      formatHeader={() => [
        'Name',
        'Type',
        'Cluster IP',
        'External IP',
        'Port(s)',
        'Age'
      ]}
      formatItems={items =>
        items.map(({ metadata, status, spec }) => [
          metadata.name,
          spec.type,
          spec.clusterIP,
          getPublicIP(status.loadBalancer),
          getPorts(spec.ports),
          metadata.creationTimestamp
        ])
      }
      dialogItems={[
        { value: 'Port Forward', type: 'services', href: 'get' },
        { value: 'Info', type: 'services', href: 'get' },
        { value: 'Edit', type: 'services', href: 'edit' },
        { value: 'Describe', type: 'services', href: 'describe' }
      ]}
    />
  );
}
