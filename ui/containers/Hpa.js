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
import { getMetrics } from '../state-management/hpa-management';

export default function Hpa({ namespace }) {
  const { config } = useConfigContext();

  const [search, setSearch] = useState('');
  const { data: response, revalidate } = useSWR(
    [namespace, 'get hpa'],
    kubectl.exec,
    { suspense: true }
  );

  const { data } = response || {};

  const items = useMemo(() => filterSearch(data, search), [data, search]);

  return (
    <div>
      <PageHeader
        title="Horizontal Pod Autoscaler"
        showSearch={true}
        search={search}
        onSearch={text => setSearch(text)}
        onRefresh={() => revalidate()}
      />
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Targets</th>
            <th>Min</th>
            <th>Max</th>
            <th>Replicas</th>
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
                <td>{getMetrics(metadata)}</td>
                <td>{spec.minReplicas}</td>
                <td>{spec.maxReplicas}</td>
                <td>{status.currentReplicas}</td>
                <td>{metadata.creationTimestamp}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
}
