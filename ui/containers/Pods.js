import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import useAxios from '@use-hooks/axios';

import PodCard from '../components/PodCard';
import { listPods } from '../state-management/pods-management';
import PageHeader from '../components/PageHeader';
import Input from '../components/Input';
import Icon from '../components/Icon';

const PodsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

const RefreshIcon = styled(Icon)`
  margin-right: 5px;
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
  const { response, loading, query } = listPods(namespace);

  const { data } = response || {};

  const items = useMemo(() => filterSearch(data, search), [data, search]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <PageHeader>
        <h1>Pods</h1>
        <RefreshIcon onClick={() => query()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="none" d="M0 0h24v24H0V0z" />
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
          </svg>
        </RefreshIcon>
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
