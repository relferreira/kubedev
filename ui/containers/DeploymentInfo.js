import React, { useState } from 'react';
import styled from '@emotion/styled';
import {
  getDeployment,
  scaleDeployment
} from '../state-management/deployments-management';
import Table from '../components/Table';
import Input from '../components/Input';
import Button from '../components/Button';

const Header = styled.div`
  display: flex;
  align-items: center;

  h1 {
    flex: 1;
  }
`;

const CustomInput = styled(Input)`
  font-size: 14px;
`;

export default function DeploymentInfo({ namespace, name }) {
  const [scale, setScale] = useState(0);
  const { response, loading, query } = getDeployment(
    namespace,
    name,
    (err, response) => {
      if (response) setScale(response.data.status.replicas);
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
      <Header>
        <h1>{metadata.name}</h1>
        <Button onClick={handleScale}>SAVE</Button>
      </Header>
      <h3>Status</h3>
      <Table>
        <thead>
          <tr>
            <th>Replicas</th>
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
            <td>{status.availableReplicas}</td>
            <td>{status.updatedReplicas}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
