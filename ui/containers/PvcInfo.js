import React from 'react';
import styled from '@emotion/styled';
import useSWR from 'swr';

import * as kubectl from '../kubectl';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import Button from '../components/Button';

const CustomTable = styled(Table)`
  margin-top: 5px;
`;

export default function PvcInfo({ namespace, name, navigate }) {
  const { data: response } = useSWR(
    [namespace, `get pvc ${name}`],
    kubectl.exec,
    { suspense: true }
  );

  const handleEdit = () => {
    navigate(`/${namespace}/pvc/${name}/edit`);
  };

  const handleDelete = () => {
    kubectl
      .exec(namespace, `delete pvc ${name}`, false)
      .then(() => navigate(`/${namespace}/pvc`))
      .catch(err => console.error(err));
  };

  const {
    data: { metadata, status, spec }
  } = response || {};

  return (
    <div>
      <PageHeader title={name}>
        <Button onClick={handleEdit}>EDIT</Button>
        <Button type="error" onClick={handleDelete}>
          DELETE
        </Button>
      </PageHeader>
      <CustomTable>
        <thead>
          <tr>
            <th>Status</th>
            <th>Capacity</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{status.phase}</td>
            <td>{status.capacity.storage}</td>
            <td>{metadata.creationTimestamp}</td>
          </tr>
        </tbody>
      </CustomTable>
      <CustomTable>
        <thead>
          <tr>
            <th>Volue</th>
            <th>Access Mode</th>
            <th>Storage Class</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{spec.volumeName}</td>
            <td>{spec.accessModes.join(',')}</td>
            <td>{spec.storageClassName}</td>
          </tr>
        </tbody>
      </CustomTable>
    </div>
  );
}
