import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';

import PageHeader from '../components/PageHeader';
import {
  listJobs,
  getCondition,
  getNumberOfJobs
} from '../state-management/jobs-management';
import PodCard from '../components/PodCard';
import DeployCard from '../components/DeployCard';
import JobCard from '../components/JobCard';

import { filterSearch } from '../state-management/general-managements';

const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

export default function Jobs({ namespace }) {
  const [search, setSearch] = useState('');
  const { response, loading, query } = listJobs(namespace);

  const { data } = response || {};

  const items = useMemo(() => filterSearch(data, search), [data, search]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <PageHeader
        title="Jobs"
        showSearch={true}
        search={search}
        onSearch={text => setSearch(text)}
        onRefresh={() => query()}
      />
      <JobsGrid>
        {items &&
          items.map(({ metadata, status }) => (
            <JobCard
              key={metadata.name}
              name={metadata.name}
              state={getCondition(status)}
              number={getNumberOfJobs(status)}
            />
          ))}
      </JobsGrid>
    </div>
  );
}
