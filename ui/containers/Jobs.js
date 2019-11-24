import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { Link } from '@reach/router';
import useSWR from 'swr';

import * as kubectl from '../kubectl';
import { useConfigContext } from '../state-management/config-management';
import PageHeader from '../components/PageHeader';
import {
  getCondition,
  getNumberOfJobs,
  getCompletedCount
} from '../state-management/jobs-management';
import JobCard from '../components/JobCard';
import Table from '../components/Table';

import { filterSearch } from '../state-management/general-managements';

const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

export default function Jobs({ namespace }) {
  const { config } = useConfigContext();

  const [search, setSearch] = useState('');
  const { data: response, revalidate } = useSWR(
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
      {config.listStyle === 'table' ? (
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Completions</th>
              <th>Completion</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {items &&
              items.map(({ metadata, status, spec }) => (
                <tr key={metadata.name}>
                  <td>
                    <Link to={`${metadata.name}/get`}>{metadata.name}</Link>
                  </td>
                  <td>{getCompletedCount(spec, status)}</td>
                  <td>{status.completionTime}</td>
                  <td>{metadata.creationTimestamp}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      ) : (
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
      )}
    </div>
  );
}
