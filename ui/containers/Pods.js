import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import useSWR from 'swr';

import * as kubectl from '../kubectl';
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
  const { data: response, error, isValidating, revalidate } = useSWR(
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
