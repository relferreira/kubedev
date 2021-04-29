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
        formatHeader={() => [
          { id: 'name', label: 'Name', sorted: true },
          {
            id: 'age',
            label: 'Age',
            align: 'right',
            sorted: true,
            type: 'date'
          }
        ]}
        formatItems={items =>
          items.map(({ metadata, status, spec }) => ({
            name: metadata.name,
            age: metadata.creationTimestamp
          }))
        }
        dialogItems={[
          { value: 'Edit', type, href: 'edit' },
          { value: 'Describe', type, href: 'describe' }
        ]}
      />
    </Fragment>
  );
}
