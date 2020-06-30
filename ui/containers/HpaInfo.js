import React from 'react';
import styled from '@emotion/styled';
import useSWR from 'swr';

import * as kubectl from '../kubectl';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import Button from '../components/Button';
import { getMetrics } from '../state-management/hpa-management';
import DeleteButton from '../components/DeleteButton';

const CustomTable = styled(Table)`
  margin-top: 5px;
`;

export default function HpaInfo({ namespace, name, navigate }) {
  const { data: response } = useSWR(
    [namespace, `get hpa ${name}`],
    kubectl.exec,
    { suspense: true }
  );

  const handleEdit = () => {
    navigate(`/ui/${namespace}/hpa/${name}/edit`);
  };

  const handleDelete = () => {
    kubectl
      .exec(namespace, `delete hpa ${name}`, false)
      .then(() => navigate(`/ui/${namespace}/hpa`))
      .catch(err => console.error(err));
  };

  const {
    data: { metadata, status, spec }
  } = response || {};

  return (
    <div>
      <PageHeader title={name}>
        <Button onClick={handleEdit}>EDIT</Button>
        <DeleteButton name={name} onClick={handleDelete}>
          DELETE
        </DeleteButton>
      </PageHeader>
      <CustomTable>
        <thead>
          <tr>
            <th>Targets</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{getMetrics(metadata)}</td>

            <td>{metadata.creationTimestamp}</td>
          </tr>
        </tbody>
      </CustomTable>
      <CustomTable>
        <thead>
          <tr>
            <th>Min</th>
            <th>Max</th>
            <th>Replicas</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{spec.minReplicas}</td>
            <td>{spec.maxReplicas}</td>
            <td>{status.currentReplicas}</td>
          </tr>
        </tbody>
      </CustomTable>
    </div>
  );
}
