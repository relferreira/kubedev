import React from 'react';
import styled from '@emotion/styled';
import useAxios from '@use-hooks/axios';

import PodCard from '../components/PodCard';

const PodsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  // grid-template-rows: 40px 100px 40px;
`;

export default function Pods() {
  const { response, loading, error, query } = useAxios({
    url: `http://localhost:8080/workers/pods`,
    method: 'GET',
    trigger: null
  });

  const { data } = response || {};

  if (loading) return <div>Loading...</div>;

  return (
    <PodsContainer>
      {/* <h1>Pods</h1> */}
      {data &&
        data.items.map(({ metadata, status }) => (
          <PodCard
            key={metadata.name}
            name={metadata.name}
            state={status.phase}
          />
        ))}
    </PodsContainer>
  );
}
