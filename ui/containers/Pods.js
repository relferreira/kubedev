import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import useAxios from '@use-hooks/axios';

import PodCard from '../components/PodCard';
import { listPods } from '../state-management/pods-management';
import PageHeader from '../components/PageHeader';
import Input from '../components/Input';

const PodsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

function filterSearch(data, search) {
  if (data && data.items) {
    return data.items.filter(({ metadata }) =>
      metadata.name.startsWith(search)
    );
  }
  return [];
}

export default function Pods({ namespace }) {
  const [search, setSearch] = useState('');
  const { response, loading } = listPods(namespace);

  const { data } = response || {};

  const items = useMemo(() => filterSearch(data, search), [data, search]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <PageHeader>
        <h1>Pods</h1>
        <Input
          value={search}
          placeholder="Search"
          onChange={event => setSearch(event.target.value)}
        />
      </PageHeader>
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
    </div>
  );
}
