import React from 'react';

import { getHosts } from '../state-management/ingress-management';
import NewTableInfo from './NewTableInfo';

export default function Ingress({ namespace, navigate }) {
  return (
    <NewTableInfo
      title="Ingress"
      type="ingress"
      namespace={namespace}
      command="get ingress"
      navigate={navigate}
      formatHeader={() => [
        { id: 'name', label: 'Name', sorted: true },
        { id: 'host', label: 'Host' },
        { id: 'age', label: 'Age', align: 'right', sorted: true, type: 'date' }
      ]}
      formatItems={items =>
        items.map(({ metadata, spec }) => ({
          name: metadata.name,
          host: getHosts(spec),
          age: metadata.creationTimestamp
        }))
      }
      dialogItems={[
        { value: 'Describe', type: 'ingress', href: 'describe' },
        { value: 'Edit', type: 'ingress', href: 'edit' }
      ]}
    />
  );
}
