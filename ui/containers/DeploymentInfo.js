import React from 'react';
import { getDeployment } from '../state-management/deployments-management';
import Table from '../components/Table';

export default function DeploymentInfo({ namespace, name }) {
  const { response, loading } = getDeployment(namespace, name);

  if (loading) return <div>Loading...</div>;

  if (!response) return null;

  const {
    data: { metadata, spec, status }
  } = response || {};

  return (
    <div>
      <h1>{metadata.name}</h1>

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
            <td>{status.replicas}</td>
            <td>{status.availableReplicas}</td>
            <td>{status.updatedReplicas}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
