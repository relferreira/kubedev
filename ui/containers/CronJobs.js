import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import useSWR from 'swr';

import * as kubectl from '../kubectl';
import { filterSearch } from '../state-management/general-managements';
import PageHeader from '../components/PageHeader';
import CronJobCard from '../components/CronJobCard';

const CronJobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

export default function CronJobs({ namespace }) {
  const [search, setSearch] = useState('');
  const { data: response, revalidate } = useSWR(
    [namespace, 'get cronjobs'],
    kubectl.exec,
    { suspense: true }
  );

  const { data } = response || {};

  const items = useMemo(() => filterSearch(data, search), [data, search]);

  return (
    <div>
      <PageHeader
        title="Cron Jobs"
        showSearch={true}
        search={search}
        onSearch={text => setSearch(text)}
        onRefresh={() => revalidate()}
      />
      <CronJobsGrid>
        {items &&
          items.map(({ metadata, spec }) => (
            <CronJobCard
              key={metadata.name}
              name={metadata.name}
              schedule={spec.schedule}
            />
          ))}
      </CronJobsGrid>
    </div>
  );
}
