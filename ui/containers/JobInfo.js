import React from 'react';
import styled from '@emotion/styled';
import PageHeader from '../components/PageHeader';

import {
  getJobInfo,
  getCondition,
  getNumberOfJobs,
  deleteJob
} from '../state-management/jobs-management';
import Table from '../components/Table';
import StatusIcon from '../components/StatusIcon';
import Button from '../components/Button';

const CustomTable = styled(Table)`
  margin-top: 5px;
`;

export default function JobInfo({ namespace, name, navigate }) {
  const { response, loading } = getJobInfo(namespace, name);

  const handleScale = () => {
    deleteJob(namespace, name)
      .then(resp => navigate('../'))
      .catch(err => {
        console.error(err);
      });
  };

  if (loading) return <div>Loading...</div>;

  if (!response) return null;

  const {
    data: { spec, status }
  } = response || {};

  return (
    <div>
      <PageHeader title={name}>
        <Button type="error" onClick={handleScale}>
          DELETE
        </Button>
      </PageHeader>
      <CustomTable>
        <thead>
          <tr>
            <th>Status</th>
            <th>Description</th>
            <th>Number</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <StatusIcon state={getCondition(status)} />
            </td>
            <td>{getCondition(status)}</td>
            <td>{getNumberOfJobs(status)}</td>
          </tr>
        </tbody>
      </CustomTable>
      <CustomTable>
        <thead>
          <tr>
            <th>Backoff Limit</th>
            <th>Completions</th>
            <th>Parallelism</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{spec.backoffLimit}</td>
            <td>{spec.completions}</td>
            <td>{spec.parallelism}</td>
          </tr>
        </tbody>
      </CustomTable>
    </div>
  );
}
