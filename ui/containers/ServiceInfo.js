import React from 'react';
import styled from '@emotion/styled';

import Table from '../components/Table';
import {
  getPublicIP,
  getServiceInfo
} from '../state-management/services-management';

export default function ServiceInfo({ namespace, name }) {
  const { response, loading } = getServiceInfo(namespace, name);

  if (loading) return <div>Loading...</div>;

  if (!response) return null;

  const {
    data: { metadata, spec, status }
  } = response || {};

  return (
    <div>
      <h1>{metadata.name}</h1>
      <h3>IPs</h3>
      <Table>
        <thead>
          <tr>
            <th>Cluster IP</th>
            <th>Public IP</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{spec.clusterIP}</td>
            <td>{getPublicIP(status.loadBalancer)}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
