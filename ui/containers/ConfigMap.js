import React, { useState, useMemo } from 'react';
import { Link } from '@reach/router';
import useSWR from 'swr';

import * as kubectl from '../kubectl';
import { useConfigContext } from '../state-management/config-management';
import { filterSearch } from '../state-management/general-managements';

import Table from '../components/Table';
import PageHeader from '../components/PageHeader';

export default function ConfigMap({ namespace }) {
  const { config } = useConfigContext();

  const [search, setSearch] = useState('');
  const { data: response, error, isValidating, revalidate } = useSWR(
    [namespace, 'get configmaps'],
    kubectl.exec,
    { suspense: true }
  );

  const { data } = response || {};

  const items = useMemo(() => filterSearch(data, search), [data, search]);

  return (
    <div>
      <PageHeader
        title="Config Maps"
        showSearch={true}
        search={search}
        onSearch={text => setSearch(text)}
        onRefresh={() => revalidate()}
      />
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Data</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {items &&
            items.map(({ data, metadata, status, spec }) => (
              <tr key={metadata.name}>
                <td>
                  {metadata.name}
                  {/* <Link to={`${metadata.name}/get`}>{metadata.name}</Link> */}
                </td>
                <td>{data && Object.keys(data).length}</td>
                <td>{metadata.creationTimestamp}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
}
