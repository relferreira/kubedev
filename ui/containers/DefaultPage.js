import React, { useState, Fragment } from 'react';

import NewTableInfo from './NewTableInfo';

export default function DefaultPage({ namespace, type, navigate }) {
  return (
    <Fragment>
      <NewTableInfo
        title={type.charAt(0).toUpperCase() + type.slice(1)}
        type={type}
        namespace={namespace}
        command={`get ${type}`}
        navigate={navigate}
        filterFields={['metadata.name', 'status.phase']}
        formatHeader={() => ['Name', { label: 'Age', align: 'right' }]}
        formatItems={items =>
          items.map(({ metadata, status, spec }) => [
            metadata.name,
            metadata.creationTimestamp
          ])
        }
        dialogItems={[
          { value: 'Edit', type, href: 'edit' },
          { value: 'Describe', type, href: 'describe' }
        ]}
      />
    </Fragment>
  );
}
