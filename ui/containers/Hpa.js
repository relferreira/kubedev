import React from 'react';

import { getMetrics } from '../state-management/hpa-management';
import NewTableInfo from './NewTableInfo';

export default function Hpa({ namespace, navigate }) {
  return (
    <NewTableInfo
      title="Horizontal Pod Autoscaler"
      namespace={namespace}
      command="get hpa"
      navigate={navigate}
      formatHeader={() => ['Name', 'Targets', 'Min', 'Max', 'Replicas', 'Age']}
      formatItems={items =>
        items.map(({ metadata, status, spec }) => [
          metadata.name,
          getMetrics(metadata),
          spec.minReplicas,
          spec.maxReplicas,
          status.currentReplicas,
          metadata.creationTimestamp
        ])
      }
      dialogItems={[
        { value: 'Info', type: 'hpa', href: 'get' },
        { value: 'Describe', type: 'hpa', href: 'describe' },
        { value: 'Edit', type: 'hpa', href: 'edit' }
      ]}
    />
  );
}
