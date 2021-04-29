import React from 'react';

import { getMetrics } from '../state-management/hpa-management';
import NewTableInfo from './NewTableInfo';

export default function Hpa({ namespace, navigate }) {
  return (
    <NewTableInfo
      title="Horizontal Pod Autoscaler"
      type="hpa"
      namespace={namespace}
      command="get hpa"
      navigate={navigate}
      formatHeader={() => [
        { id: 'name', label: 'Name', sorted: true },
        { id: 'targets', label: 'Targets' },
        { id: 'min', label: 'Min' },
        { id: 'max', label: 'Max' },
        { id: 'replicas', label: 'Replicas' },
        { id: 'age', label: 'Age', align: 'right', sorted: true, type: 'date' }
      ]}
      formatItems={items =>
        items.map(({ metadata, status, spec }) => ({
          name: metadata.name,
          targets: getMetrics(metadata),
          min: spec.minReplicas,
          max: spec.maxReplicas,
          replicas: status.currentReplicas,
          age: metadata.creationTimestamp
        }))
      }
      dialogItems={[
        // { value: 'Info', type: 'hpa', href: 'get' },
        { value: 'Describe', type: 'hpa', href: 'describe' },
        { value: 'Edit', type: 'hpa', href: 'edit' }
      ]}
    />
  );
}
