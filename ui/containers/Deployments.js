import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import useSWR from 'swr';

import * as kubectl from '../kubectl';
import DeployCard from '../components/DeployCard';
import { listDeployments } from '../state-management/deployments-management';
import PageHeader from '../components/PageHeader';
import { filterSearch } from '../state-management/general-managements';

const DeployGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

export default function Deployments({ namespace }) {
  const [search, setSearch] = useState('');
  const { data: response, error, isValidating, revalidate } = useSWR(
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
      <DeployGrid>
        {items &&
          items.map(({ metadata, status }) => (
            <DeployCard
              key={metadata.name}
              name={metadata.name}
              replicas={status.replicas}
              // state={status.phase}
            />
          ))}
      </DeployGrid>
    </div>
  );
}
