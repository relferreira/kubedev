import React from 'react';
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

const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

export default function Jobs({ namespace }) {
  const { response, loading, query } = listJobs(namespace);

  const { data } = response || {};

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <PageHeader>
        <h1>Jobs</h1>
      </PageHeader>
      <JobsGrid>
        {data &&
          data.items &&
          data.items.map(({ metadata, status }) => (
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
