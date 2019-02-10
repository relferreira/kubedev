import React from 'react';
import styled from '@emotion/styled';
import useAxios from '@use-hooks/axios';

import PodCard from '../components/PodCard';
import { listPods } from '../state-management/pods-management';

const PodsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

export default function Pods({ namespace }) {
  const { response, loading } = listPods(namespace);

  const { data } = response || {};

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Pods</h1>
      <PodsGrid>
        {/* <h1>Pods</h1> */}
        {data &&
          data.items.map(({ metadata, status }) => (
            <PodCard
              key={metadata.name}
              name={metadata.name}
              state={status.phase}
            />
          ))}
      </PodsGrid>
    </div>
  );
}
