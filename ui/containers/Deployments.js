import React, { useState, useEffect } from 'react';

import * as kubectl from '../kubectl';
import NewTableInfo from './NewTableInfo';

export default function Deployments({ namespace, navigate }) {
  const [items, setItems] = useState([]);
  const [dialogLoading, setDialogLoading] = useState(false);
  const originalItems = [
    {
      value: 'Logs',
      callback: ({ spec }) => {
        setDialogLoading(true);
        setItems([]);
        kubectl
          .exec(namespace, `get pods -l=app=${spec.selector.matchLabels.app}`)
          .then(resp => {
            const { items } = resp.data;
            setItems(
              items.map(({ metadata }) => ({
                value: metadata.name,
                href: `../pods/${metadata.name}/logs`,
                full: true
              }))
            );
          })
          .finally(() => setDialogLoading(false));
      }
    },
    { value: 'Info', href: 'get' },
    { value: 'Edit', href: 'edit' },
    { value: 'Describe', href: 'describe' }
  ];

  useEffect(() => {
    setItems(originalItems);
  }, []);

  return (
    <NewTableInfo
      title="Deployments"
      namespace={namespace}
      command="get deployments"
      navigate={navigate}
      formatHeader={() => ['Name', 'Ready', 'Up to Date', 'Available', 'Age']}
      formatItems={items =>
        items.map(({ metadata, status, spec }) => [
          metadata.name,
          spec.replicas && `${status.replicas}/${spec.replicas}`,
          status.updatedReplicas,
          status.availableReplicas,
          metadata.creationTimestamp
        ])
      }
      dialogLoading={dialogLoading}
      dialogItems={items}
      onDialogClose={() => setItems(originalItems)}
    />
  );
}
