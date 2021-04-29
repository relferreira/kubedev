import React from 'react';

import NewTableInfo from './NewTableInfo';

export default function Secret({ namespace, navigate }) {
  return (
    <NewTableInfo
      title="Secrets"
      type="secrets"
      namespace={namespace}
      command="get secrets"
      navigate={navigate}
      formatHeader={() => [
        { id: 'name', label: 'Name', sorted: true },
        { id: 'type', label: 'Type' },
        { id: 'data', label: 'Data' },
        { id: 'age', label: 'Age', align: 'right', sorted: true, type: 'date' }
      ]}
      formatItems={items =>
        items.map(({ metadata, data, type }) => ({
          name: metadata.name,
          type: type,
          data: data && Object.keys(data).length,
          age: metadata.creationTimestamp
        }))
      }
      dialogItems={[
        // { value: 'Info', type: 'secrets', href: 'get' },
        { value: 'Edit', type: 'secrets', href: 'edit' },
        { value: 'Describe', type: 'secrets', href: 'describe' }
      ]}
    />
  );
}
