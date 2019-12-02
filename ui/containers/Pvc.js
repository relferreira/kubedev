import React, { useState, useMemo } from 'react';
import { Link } from '@reach/router';
import useSWR from 'swr';

import * as kubectl from '../kubectl';
import { useConfigContext } from '../state-management/config-management';
import PageHeader from '../components/PageHeader';
import { filterSearch } from '../state-management/general-managements';
import Table from '../components/Table';

export default function Pvc({ namespace }) {
  const { config } = useConfigContext();

  const [search, setSearch] = useState('');
  const { data: response, revalidate } = useSWR(
    [namespace, 'get pvc'],
    kubectl.exec,
    { suspense: true }
  );

  const { data } = response || {};

  const items = useMemo(() => filterSearch(data, search), [data, search]);

  return (
    <div>
      <PageHeader
        title="Persistent Volume Claims"
        showSearch={true}
        search={search}
        onSearch={text => setSearch(text)}
        onRefresh={() => revalidate()}
      />
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Capacity</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {items &&
            items.map(({ metadata, status, spec }) => (
              <tr key={metadata.name}>
                <td>
                  <Link to={`${metadata.name}/get`}>{metadata.name}</Link>
                </td>
                <td>{status.phase}</td>
                <td>{status.capacity.storage}</td>
                <td>{metadata.creationTimestamp}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
}
