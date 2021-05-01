import React, { useState, useEffect } from 'react';

import * as kubectl from '../kubectl';
import NewTableInfo from './NewTableInfo';

export default function Deployments({ namespace, navigate }) {
  const [items, setItems] = useState([]);
  const [dialogLoading, setDialogLoading] = useState(false);
  const originalItems = [
    {
      value: 'Logs',
      callback: (_, { spec }) => {
        setDialogLoading(true);
        setItems([]);
        kubectl
          .exec(namespace, `get pods -l=app=${spec.selector.matchLabels.app}`)
          .then(resp => {
            const { items } = resp.data;
            setItems(
              items.map(({ metadata }) => ({
                value: metadata.name,
                href: `pods/${metadata.name}/logs`
              }))
            );
          })
          .finally(() => setDialogLoading(false));
      }
    },
    { value: 'Info', type: 'deployments', href: 'get' },
    { value: 'Edit', type: 'deployments', href: 'edit' },
    { value: 'Describe', type: 'deployments', href: 'describe' }
  ];

  useEffect(() => {
    setItems(originalItems);
  }, []);

  return (
    <NewTableInfo
      title="Deployments"
      type="deployments"
      namespace={namespace}
      command="get deployments"
      navigate={navigate}
      formatHeader={() => [
        { id: 'name', label: 'Name', align: 'left', sorted: true },
        { id: 'ready', label: 'Ready', align: 'center' },
        { id: 'upToDate', label: 'Up to Date', align: 'center' },
        { id: 'available', label: 'Available', align: 'center' },
        { id: 'age', label: 'Age', align: 'right', sorted: true, type: 'date' }
      ]}
      formatItems={items =>
        items.map(({ metadata, status, spec }) => ({
          name: metadata.name,
          ready: spec.replicas && `${status.replicas}/${spec.replicas}`,
          upToDate: status.updatedReplicas,
          available: status.availableReplicas,
          age: metadata.creationTimestamp
        }))
      }
      dialogLoading={dialogLoading}
      dialogItems={items}
      onDialogClose={() => setItems(originalItems)}
    />
  );
}
