import React from 'react';
import styled from '@emotion/styled';
import useSWR from 'swr';

import * as kubectl from '../kubectl';
import PageHeader from '../components/PageHeader';
import {
  getCondition,
  getNumberOfJobs
} from '../state-management/jobs-management';
import Table from '../components/Table';
import StatusIcon from '../components/StatusIcon';
import Button from '../components/Button';

const CustomTable = styled(Table)`
  margin-top: 5px;
`;

export default function JobInfo({ namespace, name, navigate }) {
  const { data: response } = useSWR(
    [namespace, `get job ${name}`],
    kubectl.exec,
    { suspense: true }
  );

  const handleDelete = () => {
    kubectl
      .exec(namespace, `delete job ${name}`, false)
      .then(() => navigate(`/${namespace}/jobs`))
      .catch(err => console.error(err));
  };

  const {
    data: { spec, status }
  } = response || {};

  return (
    <div>
      <PageHeader title={name}>
        <Button type="error" onClick={handleDelete}>
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
