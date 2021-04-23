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
        columns={['Name', 'Type', 'Namespace', 'From', 'To']}
        items={
          pids &&
          pids.map(({ pid, namespace, type, name, from, to }) => [
            <Link to={`/ui/${namespace}/${type}/${name}/get`}>{name}</Link>,
            type,
            namespace,
            from,
            to
          ])
        }
      />
    </div>
  );
}
