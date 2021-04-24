import React from 'react';

import NewTableInfo from './NewTableInfo';

export default function Secret({ namespace, navigate }) {
  return (
    <NewTableInfo
      title="Secrets"
      namespace={namespace}
      command="get secrets"
      navigate={navigate}
      formatHeader={() => ['Name', 'Type', 'Data', 'Age']}
      formatItems={items =>
        items.map(({ metadata, data, type }) => [
          metadata.name,
          type,
          data && Object.keys(data).length,
          metadata.creationTimestamp
        ])
      }
      dialogItems={[
        // { value: 'Info', type: 'secrets', href: 'get' },
        { value: 'Edit', type: 'secrets', href: 'edit' },
        { value: 'Describe', type: 'secrets', href: 'describe' }
      ]}
    />
  );
}
