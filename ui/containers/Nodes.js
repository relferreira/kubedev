import React, { useState, useMemo } from 'react';
import { Link } from '@reach/router';
import useSWR from 'swr';

import * as kubectl from '../kubectl';
import PageHeader from '../components/PageHeader';
import { filterSearch } from '../state-management/general-managements';
import Table from '../components/Table';
import {
  getNodeStatus,
  getNodeKubernetesVersion,
  getNodeRole
} from '../state-management/node-management';

export default function Nodes({ namespace }) {
  const [search, setSearch] = useState('');
  const { data: response, revalidate } = useSWR(
    [namespace, 'get nodes'],
    kubectl.exec,
    { suspense: true }
  );

  const { data } = response || {};

  const items = useMemo(() => filterSearch(data, search), [data, search]);

  return (
    <div>
      <PageHeader
        title="Nodes"
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
            <th>Roles</th>
            <th>Version</th>
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
                <td>{getNodeStatus(status)}</td>
                <td>{getNodeRole(metadata)}</td>
                <td>{getNodeKubernetesVersion(status)}</td>
                <td>{metadata.creationTimestamp}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
}
