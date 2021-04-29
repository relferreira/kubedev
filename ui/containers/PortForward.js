import React, { useState, useEffect } from 'react';
import { Link } from '@reach/router';

import Table from '../components/Table';
import PageHeader from '../components/PageHeader';
import { getStoredPids } from '../state-management/port-forward-management';

export default function PortForward() {
  const [pids, setPids] = useState([]);

  useEffect(() => {
    let storedPids = getStoredPids();
    if (storedPids) setPids(Object.values(storedPids));
  }, []);

  return (
    <div>
      <PageHeader title="Port Forward" showSearch={false} />
      <Table
        columns={[
          { id: 'name', label: 'Name', sorted: true },
          { id: 'type', label: 'Type' },
          { id: 'namespace', label: 'Namespace' },
          { id: 'from', label: 'From' },
          { id: 'to', label: 'To' }
        ]}
        items={
          pids &&
          pids.map(({ pid, namespace, type, name, from, to }) => ({
            // TODO transfer to column render
            // name: (
            //   <Link to={`/ui/${namespace}/${type}/${name}/get`}>{name}</Link>
            // ),
            name,
            type: type,
            namespace: namespace,
            from: from,
            to: to
          }))
        }
      />
    </div>
  );
}
