import React from 'react';
import styled from '@emotion/styled';
import { Link } from '@reach/router';

import { useConfigContext } from '../state-management/config-management';
import CronJobCard from '../components/CronJobCard';
import Table from '../components/Table';
import { getActiveJobs } from '../state-management/jobs-management';
import TableInfo from './TableInfo';

const CronJobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

export default function CronJobs({ namespace }) {
  const { config } = useConfigContext();

  return (
    <TableInfo title="Cron Jobs" namespace={namespace} command="get cronjobs">
      {items =>
        config.listStyle === 'table' ? (
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
        )
      }
    </TableInfo>
  );
}
