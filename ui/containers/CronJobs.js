import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { Link } from '@reach/router';
import useSWR from 'swr';

import * as kubectl from '../kubectl';
import { useConfigContext } from '../state-management/config-management';
import { filterSearch } from '../state-management/general-managements';
import PageHeader from '../components/PageHeader';
import CronJobCard from '../components/CronJobCard';
import Table from '../components/Table';
import { getActiveJobs } from '../state-management/jobs-management';

const CronJobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

export default function CronJobs({ namespace }) {
  const { config } = useConfigContext();

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
      {config.listStyle === 'table' ? (
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Schedule</th>
              <th>Suspend</th>
              <th>Active</th>
              <th>Last Schedule</th>
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
                  <td>{spec.schedule}</td>
                  <td>{spec.suspend.toString().toUpperCase()}</td>
                  <td>{getActiveJobs(status)}</td>
                  <td>{status.lastScheduleTime}</td>
                  <td>{metadata.creationTimestamp}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      ) : (
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
      )}
    </div>
  );
}
