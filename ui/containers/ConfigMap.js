import React from 'react';

import NewTableInfo from './NewTableInfo';

export default function ConfigMap({ namespace, navigate }) {
  return (
    <NewTableInfo
      title="Config Maps"
      type="configmaps"
      namespace={namespace}
      command="get configmaps"
      navigate={navigate}
      formatHeader={() => [
        { id: 'name', label: 'Name', sorted: true },
        { id: 'data', label: 'Data' },
        { id: 'age', label: 'Age', align: 'right', sorted: true, type: 'date' }
      ]}
      formatItems={items =>
        items.map(({ metadata, data }) => ({
          name: metadata.name,
          data: data && Object.keys(data).length,
          age: metadata.creationTimestamp
        }))
      }
      dialogItems={[
        { value: 'Edit', type: 'configmaps', href: 'edit' },
        { value: 'Describe', type: 'configmaps', href: 'describe' }
      ]}
    />
  );
}
