import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import useSWR from 'swr';

import * as kubectl from '../kubectl';
import Table from '../components/Table';
import Input from '../components/Input';
import Button from '../components/Button';
import PageHeader from '../components/PageHeader';
import { Link } from '@reach/router';
import Icon from '../components/Icon';
import StatusIcon from '../components/StatusIcon';
import CustomTooltip from '../components/CustomTooltip';
import DeleteButton from '../components/DeleteButton';
import NewTableInfo from './NewTableInfo';

const CustomInput = styled(Input)`
  font-size: 14px;
`;

const SectionTitle = styled.h3`
  margin-top: 16px;
  margin-bottom: 8px;
`;

const PodStatusIcon = styled(StatusIcon)`
  width: 12px;
  height: 12px;
`;

const RefreshIcon = styled(Icon)`
  margin-right: 5px;
`;

export default function DeploymentInfo({ namespace, type, name, navigate }) {
  const [scale, setScale] = useState('');
  const {
    data: {
      data: { metadata, spec, status }
    },
    error,
    isValidating,
    revalidate
  } = useSWR(
    [namespace, `get ${type} ${name}`],
    (namespace, command) => kubectl.exec(namespace, command, true),
    {
      suspense: true
    }
  );

  const handleScale = () => {
    kubectl
      .exec(namespace, `scale ${type} ${name} --replicas=${scale}`, false)
      .then(() => {
        revalidate();
        revalidatePods();
      });
  };

  const handleDelete = () => {
    kubectl
      .exec(namespace, `delete ${type} ${name}`, false)
      .then(() => navigate(`/ui/${namespace}/${type}`))
      .catch(err => console.error(err));
  };

  const handleEdit = () => {
    navigate(`/ui/${namespace}/${type}/${name}/edit`);
  };

  const handleRefresh = () => {
    revalidate();
    revalidatePods();
  };

  useMemo(() => setScale(spec.replicas), [spec.replicas]);

  return (
    <div>
      <PageHeader title={metadata.name}>
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
        <DeleteButton name={metadata.name} onClick={handleDelete}>
          DELETE
        </DeleteButton>
        <Button onClick={handleEdit}>EDIT</Button>
        <Button onClick={handleScale}>SAVE</Button>
      </PageHeader>
      <SectionTitle>Status</SectionTitle>
      <Table>
        <thead>
          <tr>
            <th>Replicas</th>
            <th>Ready Replicas</th>
            <th>Available Replicas</th>
            <th>Updated Replicas</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <CustomInput
                type="text"
                placeholder="Replicas"
                value={scale}
                onChange={event => setScale(+event.target.value)}
              />
            </td>
            <td>{status.readyReplicas}</td>
            <td>{status.availableReplicas}</td>
            <td>{status.updatedReplicas}</td>
          </tr>
        </tbody>
      </Table>
      {spec && (
        <NewTableInfo
          title="Pods"
          type="pods"
          namespace={namespace}
          command={`get pods -l=app=${spec.selector.matchLabels.app}`}
          navigate={navigate}
          formatHeader={() => ['Name', 'State', 'Info']}
          formatItems={items =>
            items.map(({ metadata, status, spec }) => [
              metadata.name,
              <PodStatusIcon state={status.phase} />,
              <Link to={`/ui/${namespace}/pods/${metadata.name}/get`}>
                <Icon
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path fill="none" d="M0 0h24v24H0V0z" />
                  <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </Icon>
              </Link>
            ])
          }
          dialogItems={[
            { value: 'Logs', type: `/ui/${namespace}/pods`, href: 'logs' },
            { value: 'Edit', type: `/ui/${namespace}/pods`, href: 'edit' },
            // { value: 'Info', type: `/ui/${namespace}/pods`, href: 'get' },
            {
              value: 'Describe',
              type: `/ui/${namespace}/pods`,
              href: 'describe'
            }
          ]}
        />
      )}
    </div>
  );
}
