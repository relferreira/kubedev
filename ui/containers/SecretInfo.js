import React from 'react';
import styled from '@emotion/styled';
import useSWR from 'swr';

import * as kubectl from '../kubectl';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import Button from '../components/Button';
import DeleteButton from '../components/DeleteButton';

const CustomTable = styled(Table)`
  margin-top: 5px;
`;

const SectionTitle = styled.h3`
  margin-top: 16px;
  margin-bottom: 8px;
`;

export default function SecretInfo({ namespace, name, navigate }) {
  const { data: response } = useSWR(
    [namespace, `get secrets ${name}`],
    kubectl.exec,
    { suspense: true }
  );

  const handleEdit = () => {
    navigate(`/ui/${namespace}/secrets/${name}/edit`);
  };

  const handleDelete = () => {
    kubectl
      .exec(namespace, `delete secrets ${name}`, false)
      .then(() => navigate(`/ui/${namespace}/secrets`))
      .catch(err => console.error(err));
  };

  const {
    data: { metadata, status, spec, type, data }
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
            <th>Type</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{type}</td>
            <td>{metadata.creationTimestamp}</td>
          </tr>
        </tbody>
      </CustomTable>
      <SectionTitle>Secrets</SectionTitle>
      <CustomTable>
        <thead>
          <tr>
            <th>Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(data).map(dataKey => (
            <tr key={dataKey}>
              <td>{dataKey}</td>
              <td>{data[dataKey]}</td>
            </tr>
          ))}
        </tbody>
      </CustomTable>
    </div>
  );
}
