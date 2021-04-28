import React from 'react';

import { getCompletedCount } from '../state-management/jobs-management';
import NewTableInfo from './NewTableInfo';

export default function ScaledObjects({ namespace, navigate }) {
  return (
    <NewTableInfo
      title="Scaled Objects"
      type="scaledobjects"
      namespace={namespace}
      command="get scaledobjects"
      navigate={navigate}
      formatHeader={() => ['Name', 'Min Replicas', 'Max Replicas']}
      formatItems={items =>
        items.map(({ metadata, status, spec }) => [
          metadata.name,
          spec.minReplicaCount,
          spec.maxReplicaCount
        ])
      }
      dialogItems={[
        { value: 'Edit', type: 'scaledobjects', href: 'edit' },
        { value: 'Describe', type: 'scaledobjects', href: 'describe' }
      ]}
    />
  );
}
