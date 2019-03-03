import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import useAxios from '@use-hooks/axios';

import PodCard from '../components/PodCard';
import { listPods } from '../state-management/pods-management';
import PageHeader from '../components/PageHeader';
import Input from '../components/Input';
import { filterSearch } from '../state-management/general-managements';
const PodsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

export default function Pods({ namespace }) {
  const [search, setSearch] = useState('');
  const { response, loading, query } = listPods(namespace);

  const { data } = response || {};

  const items = useMemo(() => filterSearch(data, search), [data, search]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <PageHeader
        title="Pods"
        showSearch={true}
        search={search}
        onSearch={text => setSearch(text)}
        onRefresh={() => query()}
      />
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
