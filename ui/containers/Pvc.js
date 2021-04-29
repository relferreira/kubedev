import React from 'react';

import NewTableInfo from './NewTableInfo';

export default function Pvc({ namespace, navigate }) {
  return (
    <NewTableInfo
      title="Persistent Volume Claims"
      type="pvc"
      namespace={namespace}
      command="get pvc"
      navigate={navigate}
      formatHeader={() => [
        { id: 'name', label: 'Name', sorted: true },
        { id: 'status', label: 'Status' },
        { id: 'capacity', label: 'Capacity' },
        { id: 'age', label: 'Age', align: 'right', sorted: true, type: 'date' }
      ]}
      formatItems={items =>
        items.map(({ metadata, status }) => ({
          name: metadata.name,
          status: status.phase,
          capacity: status.capacity && status.capacity.storage,
          age: metadata.creationTimestamp
        }))
      }
      dialogItems={[
        // { value: 'Info', type: 'pvc', href: 'get' },
        { value: 'Edit', type: 'pvc', href: 'edit' },
        { value: 'Describe', type: 'pvc', href: 'describe' }
      ]}
    />
  );
}
