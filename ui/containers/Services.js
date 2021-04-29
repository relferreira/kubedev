import React from 'react';

import { getPublicIP, getPorts } from '../state-management/services-management';
import NewTableInfo from './NewTableInfo';

export default function Services({ namespace, navigate }) {
  return (
    <NewTableInfo
      title="Services"
      type="services"
      namespace={namespace}
      command="get services"
      navigate={navigate}
      formatHeader={() => [
        { id: 'name', label: 'Name', sorted: true },
        { id: 'yype', label: 'Type' },
        { id: 'clusterIP', label: 'Cluster IP' },
        { id: 'externalIP', label: 'External IP' },
        { id: 'port', label: 'Port(s)' },
        { id: 'age', label: 'Age', align: 'right', sorted: true, type: 'date' }
      ]}
      formatItems={items =>
        items.map(({ metadata, status, spec }) => ({
          name: metadata.name,
          yype: spec.type,
          clusterIP: spec.clusterIP,
          externalIP: getPublicIP(status.loadBalancer),
          port: getPorts(spec.ports),
          age: metadata.creationTimestamp
        }))
      }
      dialogItems={[
        { value: 'Port Forward', type: 'services', href: 'get' },
        // { value: 'Info', type: 'services', href: 'get' },
        { value: 'Edit', type: 'services', href: 'edit' },
        { value: 'Describe', type: 'services', href: 'describe' }
      ]}
    />
  );
}
