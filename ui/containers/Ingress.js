import React from 'react';

import { getHosts } from '../state-management/ingress-management';
import NewTableInfo from './NewTableInfo';

export default function Ingress({ namespace, navigate }) {
  return (
    <NewTableInfo
      title="Ingress"
      namespace={namespace}
      command="get ingress"
      navigate={navigate}
      formatHeader={() => ['Name', 'Host', 'Age']}
      formatItems={items =>
        items.map(({ metadata, spec }) => [
          metadata.name,
          getHosts(spec),
          metadata.creationTimestamp
        ])
      }
      dialogItems={[
        { value: 'Describe', type: 'ingress', href: 'describe' },
        { value: 'Edit', type: 'ingress', href: 'edit' }
      ]}
    />
  );
}
