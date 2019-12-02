import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { Link } from '@reach/router';
import useSWR from 'swr';

import * as kubectl from '../kubectl';
import { useConfigContext } from '../state-management/config-management';
import PodCard from '../components/PodCard';
import PageHeader from '../components/PageHeader';
import { filterSearch } from '../state-management/general-managements';
import Table from '../components/Table';
import {
  getContainersReady,
  getContainersRestarts
} from '../state-management/pod-management';

const PodsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

export default function Pods({ namespace }) {
  const { config } = useConfigContext();

  const [search, setSearch] = useState('');
  const { data: response, revalidate } = useSWR(
    [namespace, 'get pods'],
    kubectl.exec,
    { suspense: true }
  );

  const { data } = response || {};

  const items = useMemo(() => filterSearch(data, search), [data, search]);

  return (
    <div>
      <PageHeader
        title="Pods"
        showSearch={true}
        search={search}
        onSearch={text => setSearch(text)}
        onRefresh={() => revalidate()}
      />
      {config.listStyle === 'table' ? (
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Ready</th>
              <th>Status</th>
              <th>Restarts</th>
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
                  <td>{getContainersReady(spec, status)}</td>
                  <td>{status.phase}</td>
                  <td>{getContainersRestarts(status)}</td>
                  <td>{metadata.creationTimestamp}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      ) : (
        <PodsGrid>
          {items &&
            items.map(({ metadata, status }) => (
              <PodCard
                key={metadata.name}
                name={metadata.name}
                state={status.phase}
              />
            ))}
        </PodsGrid>
      )}
    </div>
  );
}
