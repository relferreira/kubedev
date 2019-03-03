import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';

import { listCronJobs } from '../state-management/jobs-management';
import { filterSearch } from '../state-management/general-managements';
import PageHeader from '../components/PageHeader';
import JobCard from '../components/JobCard';
import CronJobCard from '../components/CronJobCard';

const CronJobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

export default function CronJobs({ namespace }) {
  const [search, setSearch] = useState('');
  const { response, loading, query } = listCronJobs(namespace);

  const { data } = response || {};

  const items = useMemo(() => filterSearch(data, search), [data, search]);

  if (loading) return <div>Loading...</div>;
  console.log(data);
  return (
    <div>
      <PageHeader
        title="Cron Jobs"
        showSearch={true}
        search={search}
        onSearch={text => setSearch(text)}
        onRefresh={() => query()}
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
