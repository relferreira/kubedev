import React, { useState, Fragment } from 'react';

import NewTableInfo from './NewTableInfo';

import * as componentProps from './configs';

export default function DefaultPage({ namespace, type, navigate }) {
  let compProps = componentProps[type] || {};
  const [dialogItems, setDialogItems] = useState(
    (compProps && compProps.dialogItems) || [
      { value: 'Edit', type, href: 'edit' },
      { value: 'Describe', type, href: 'describe' }
    ]
  );
  const [dialogLoading, setDialogLoading] = useState(
    (compProps && compProps.dialogLoading) || false
  );

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
        {...compProps}
        dialogLoading={dialogLoading}
        dialogItems={dialogItems}
        setDialogItems={i => console.log(i) || setDialogItems(i)}
        setDialogLoading={setDialogLoading}
      />
    </Fragment>
  );
}
