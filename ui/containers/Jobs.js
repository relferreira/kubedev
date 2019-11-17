import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import useSWR from 'swr';

import * as kubectl from '../kubectl';
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
  const { data: response, error, isValidating, revalidate } = useSWR(
    [namespace, 'get jobs'],
    kubectl.exec,
    { suspense: true }
  );

  const { data } = response || {};

  const items = useMemo(() => filterSearch(data, search), [data, search]);

  return (
    <div>
      <PageHeader
        title="Jobs"
        showSearch={true}
        search={search}
        onSearch={text => setSearch(text)}
        onRefresh={() => revalidate()}
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
