import React from 'react';
import styled from '@emotion/styled';
import useSWR from 'swr';

import * as kubectl from '../kubectl';
import Table from '../components/Table';
import PodStatus from '../components/StatusIcon';
import Button from '../components/Button';
import Icon from '../components/Icon';
import CustomTooltip from '../components/CustomTooltip';
import DeleteButton from '../components/DeleteButton';

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

const RefreshIcon = styled(Icon)`
  margin-right: 5px;
`;

export default function PodInfo({ namespace, name, navigate }) {
  const { data: response, error, isValidating, revalidate } = useSWR(
    [namespace, `get pod ${name}`],
    kubectl.exec,
    { suspense: true }
  );

  const handleLogs = () => {
    navigate(`/ui/${namespace}/pods/${name}/logs`);
  };

  const handleEdit = () => {
    navigate(`/ui/${namespace}/pods/${name}/edit`);
  };

  const handleDelete = () => {
    kubectl
      .exec(namespace, `delete pod ${name}`, false)
      .then(() => navigate(`/ui/${namespace}/pods`))
      .catch(err => console.error(err));
  };

  const handleRefresh = () => revalidate();

  const {
    data: { metadata, spec, status }
  } = response || {};

  return (
    <div>
      <ContainerHeader>
        <PodStatus state={status.phase} />
        <h1>{metadata.name}</h1>
        <CustomTooltip label="Refresh">
          <RefreshIcon onClick={handleRefresh}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path fill="none" d="M0 0h24v24H0V0z" />
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
            </svg>
          </RefreshIcon>
        </CustomTooltip>
        <Button type="primary" onClick={handleLogs}>
          LOGS
        </Button>
        <Button onClick={handleEdit}>EDIT</Button>
        <DeleteButton name={metadata.name} onClick={handleDelete}>
          DELETE
        </DeleteButton>
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
