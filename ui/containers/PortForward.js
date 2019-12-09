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
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Namespace</th>
            <th>From</th>
            <th>To</th>
          </tr>
        </thead>
        <tbody>
          {pids &&
            pids.map(({ pid, namespace, type, name, from, to }) => (
              <tr key={pid}>
                <td>
                  <Link to={`/${namespace}/${type}/${name}/get`}>{name}</Link>
                </td>
                <td>{type}</td>
                <td>{namespace}</td>
                <td>{from}</td>
                <td>{to}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
}
