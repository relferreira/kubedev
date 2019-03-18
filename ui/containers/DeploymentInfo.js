import React, { useState } from 'react';
import styled from '@emotion/styled';
import {
  getDeployment,
  scaleDeployment,
  deleteDeployment
} from '../state-management/deployments-management';
import Table from '../components/Table';
import Input from '../components/Input';
import Button from '../components/Button';
import PageHeader from '../components/PageHeader';
import { Link } from '@reach/router';
import Icon from '../components/Icon';
import StatusIcon from '../components/StatusIcon';

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

export default function DeploymentInfo({ namespace, name, navigate }) {
  const [scale, setScale] = useState(0);
  const { response, loading, query } = getDeployment(
    namespace,
    name,
    (err, response) => {
      if (response && response.data && response.data.deployment)
        setScale(response.data.deployment.spec.replicas);
    }
  );

  const handleScale = () => {
    scaleDeployment(namespace, name, scale).then(() => query());
  };

  const handleDelete = () => {
    deleteDeployment(namespace, name)
      .then(() => navigate(`/${namespace}/deployments`))
      .catch(err => console.error(err));
  };

  if (loading) return <div>Loading...</div>;

  if (!response) return null;

  const {
    data: {
      deployment: { metadata, spec, status },
      pods: { items: podItems }
    }
  } = response || {};

  return (
    <div>
      <PageHeader title={metadata.name}>
        <Button type="error" onClick={handleDelete}>
          DELETE
        </Button>
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
      <SectionTitle>Pods</SectionTitle>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>State</th>
            <th>Info</th>
          </tr>
        </thead>
        <tbody>
          {podItems.map(({ metadata, status }) => (
            <tr key={metadata.name}>
              <td>{metadata.name}</td>
              <td>
                <PodStatusIcon state={status.phase} />
              </td>
              <td>
                <Link to={`/${namespace}/pods/${metadata.name}/info`}>
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
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
