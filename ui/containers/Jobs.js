import React from 'react';
import styled from '@emotion/styled';
import { Link } from '@reach/router';

import { useConfigContext } from '../state-management/config-management';
import {
  getCondition,
  getNumberOfJobs,
  getCompletedCount
} from '../state-management/jobs-management';
import JobCard from '../components/JobCard';
import Table from '../components/Table';

import TableInfo from './TableInfo';

const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

export default function Jobs({ namespace }) {
  const { config } = useConfigContext();

  return (
    <TableInfo title="Jobs" namespace={namespace} command="get jobs">
      {items =>
        config.listStyle === 'table' ? (
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
        )
      }
    </TableInfo>
  );
}
