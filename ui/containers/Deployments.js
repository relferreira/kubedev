import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import useAxios from '@use-hooks/axios';

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
  const { response, loading, query } = listDeployments(namespace);
  console.log(response);
  const { data } = response || {};

  const items = useMemo(() => filterSearch(data, search), [data, search]);

  if (loading) return <div>Loading...</div>;

  if (!response) return null;

  return (
    <div>
      <PageHeader
        title="Deployments"
        showSearch={true}
        search={search}
        onSearch={text => setSearch(text)}
        onRefresh={() => query()}
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
