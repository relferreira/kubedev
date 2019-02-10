import React from 'react';
import styled from '@emotion/styled';

import Table from '../components/Table';
import {
  getPublicIP,
  getServiceInfo
} from '../state-management/services-management';

const ServiceType = styled.h3`
  margin-bottom: 16px;
`;

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
      <ServiceType>Type: {spec.type}</ServiceType>
      <h3>IPs</h3>
      <Table>
        <thead>
          <tr>
            <th>Cluster IP</th>
            <th>Public IP</th>
            <th>Ports</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{spec.clusterIP}</td>
            <td>{getPublicIP(status.loadBalancer)}</td>
            <td>
              {spec.ports.map(portInfo => (
                <p key={portInfo.port}>
                  {portInfo.port}/{portInfo.protocol}
                </p>
              ))}
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
