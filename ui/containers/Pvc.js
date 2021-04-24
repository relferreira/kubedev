import React from 'react';

import NewTableInfo from './NewTableInfo';

export default function Pvc({ namespace, navigate }) {
  return (
    <NewTableInfo
      title="Persistent Volume Claims"
      namespace={namespace}
      command="get pvc"
      navigate={navigate}
      formatHeader={() => ['Name', 'Status', 'Capacity', 'Age']}
      formatItems={items =>
        items.map(({ metadata, status }) => [
          metadata.name,
          status.phase,
          status.capacity && status.capacity.storage,
          metadata.creationTimestamp
        ])
      }
      dialogItems={[
        // { value: 'Info', type: 'pvc', href: 'get' },
        { value: 'Edit', type: 'pvc', href: 'edit' },
        { value: 'Describe', type: 'pvc', href: 'describe' }
      ]}
    />
  );
}
