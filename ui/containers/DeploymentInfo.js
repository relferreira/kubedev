import React, { useState } from 'react';
import styled from '@emotion/styled';
import {
  getDeployment,
  scaleDeployment
} from '../state-management/deployments-management';
import Table from '../components/Table';
import Input from '../components/Input';
import Button from '../components/Button';
import PageHeader from '../components/PageHeader';

const CustomInput = styled(Input)`
  font-size: 14px;
`;

export default function DeploymentInfo({ namespace, name }) {
  const [scale, setScale] = useState(0);
  const { response, loading, query } = getDeployment(
    namespace,
    name,
    (err, response) => {
      if (response) setScale(response.data.spec.replicas);
    }
  );

  const handleScale = () => {
    scaleDeployment(namespace, name, scale).then(() => query());
  };

  if (loading) return <div>Loading...</div>;

  if (!response) return null;

  const {
    data: { metadata, spec, status }
  } = response || {};

  return (
    <div>
      <PageHeader title={metadata.name}>
        <Button onClick={handleScale}>SAVE</Button>
      </PageHeader>
      <h3>Status</h3>
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
    </div>
  );
}
