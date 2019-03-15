import React from 'react';
import styled from '@emotion/styled';
import useAxios from '@use-hooks/axios';

import Table from '../components/Table';
import PodStatus from '../components/StatusIcon';
import { getPodInfo, deletePod } from '../state-management/pods-management';
import Button from '../components/Button';

const ContainerHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  h1 {
    flex: 1;
    margin-left: 16px;
    margin-bottom: 0;
  }
  button {
    margin-left: 10px;
  }
`;

const ContainerInfo = styled.div`
  margin-top: 16px;
`;

const CustomTable = styled(Table)`
  margin-top: 5px;
`;

export default function PodInfo({ namespace, name, navigate }) {
  const { response, loading } = getPodInfo(namespace, name);

  const handleLogs = () => {
    navigate(`/${namespace}/pods/${name}/logs/container/0`);
  };

  const handleDelete = () => {
    deletePod(namespace, name)
      .then(() => navigate(`/${namespace}/pods`))
      .catch(err => console.error(err));
  };

  if (loading) return <div>Loading...</div>;

  if (!response) return null;

  const {
    data: { metadata, spec, status }
  } = response || {};

  return (
    <div>
      <ContainerHeader>
        <PodStatus state={status.phase} />
        <h1>{metadata.name}</h1>
        <Button type="primary" onClick={handleLogs}>
          LOGS
        </Button>
        <Button type="error" onClick={handleDelete}>
          DELETE
        </Button>
      </ContainerHeader>
      <h3>Containers</h3>

      {spec.containers.map(container => (
        <ContainerInfo key={container.name}>
          <p>
            <strong>{container.name}</strong>
          </p>
          <p>
            <span>{container.image}</span>
          </p>
          {container.resources && (
            <CustomTable>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>CPU</th>
                  <th>Memory</th>
                </tr>
              </thead>
              <tbody>
                {container.resources.limits && (
                  <tr>
                    <td>Limits</td>
                    <td>{container.resources.limits.cpu}</td>
                    <td>{container.resources.limits.memory}</td>
                  </tr>
                )}
                {container.resources.requests && (
                  <tr>
                    <td>Requests</td>
                    <td>{container.resources.requests.cpu}</td>
                    <td>{container.resources.requests.memory}</td>
                  </tr>
                )}
              </tbody>
            </CustomTable>
          )}
        </ContainerInfo>
      ))}
    </div>
  );
}
