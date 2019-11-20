import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { Link } from '@reach/router';
import useSWR from 'swr';

import * as kubectl from '../kubectl';
import DeployCard from '../components/DeployCard';
import PageHeader from '../components/PageHeader';
import { filterSearch } from '../state-management/general-managements';
import Table from '../components/Table';

const DeployGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

const DeploymentLink = styled(Link)`
  color: inherit;
`;

export default function Deployments({ namespace }) {
  const [search, setSearch] = useState('');
  const { data: response, revalidate } = useSWR(
    [namespace, 'get deployments'],
    kubectl.exec,
    { suspense: true }
  );
  const { data } = response || {};

  const items = useMemo(() => filterSearch(data, search), [data, search]);

  return (
    <div>
      <PageHeader
        title="Deployments"
        showSearch={true}
        search={search}
        onSearch={text => setSearch(text)}
        onRefresh={() => revalidate()}
      />
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Ready</th>
            <th>Up to Date</th>
            <th>Available</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {items &&
            items.map(({ metadata, status, spec }) => (
              <tr key={metadata.name}>
                <td>
                  <DeploymentLink to={`${metadata.name}/info`}>
                    {metadata.name}
                  </DeploymentLink>
                </td>
                <td>
                  {spec.replicas && `${status.replicas}/${spec.replicas}`}
                </td>
                <td>{status.updatedReplicas}</td>
                <td>{status.availableReplicas}</td>
                <td>{metadata.creationTimestamp}</td>
              </tr>
            ))}
        </tbody>
      </Table>
      {/* <DeployGrid>
        {items &&
          items.map(({ metadata, status }) => (
            <DeployCard
              key={metadata.name}
              name={metadata.name}
              replicas={status.replicas}
              // state={status.phase}
            />
          ))}
      </DeployGrid> */}
    </div>
  );
}
