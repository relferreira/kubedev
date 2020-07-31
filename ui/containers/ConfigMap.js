import React from 'react';

import NewTableInfo from './NewTableInfo';

export default function ConfigMap({ namespace, navigate }) {
  return (
    <NewTableInfo
      title="Config Maps"
      namespace={namespace}
      command="get configmaps"
      navigate={navigate}
      formatHeader={() => ['Name', 'Data', 'Age']}
      formatItems={items =>
        items.map(({ metadata, data }) => [
          metadata.name,
          data && Object.keys(data).length,
          metadata.creationTimestamp
        ])
      }
      dialogItems={[
        { value: 'Edit', type: 'configmaps', href: 'edit' },
        { value: 'Describe', type: 'configmaps', href: 'describe' }
      ]}
    />
  );
}
