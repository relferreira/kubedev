import React from 'react';
import styled from '@emotion/styled';
import useAxios from '@use-hooks/axios';

import DeployCard from '../components/DeployCard';
import { listDeployments } from '../state-management/deployments-management';

const DeployGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

export default function Deployments({ namespace }) {
  const { response, loading } = listDeployments(namespace);

  if (loading) return <div>Loading...</div>;

  if (!response) return null;

  const {
    data: { items }
  } = response || {};

  return (
    <div>
      <h1>Deployments</h1>
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
