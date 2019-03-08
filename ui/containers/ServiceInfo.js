import React from 'react';
import styled from '@emotion/styled';

import Table from '../components/Table';
import {
  getPublicIP,
  getServiceInfo,
  deleteService
} from '../state-management/services-management';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';

const ServiceType = styled.h3`
  margin-bottom: 16px;
`;

export default function ServiceInfo({ namespace, name, navigate }) {
  const { response, loading } = getServiceInfo(namespace, name);

  const handleDelete = () => {
    deleteService(namespace, name)
      .then(() => navigate(`/${namespace}/services`))
      .catch(err => console.error(err));
  };

  if (loading) return <div>Loading...</div>;

  if (!response) return null;

  const {
    data: { metadata, spec, status }
  } = response || {};

  return (
    <div>
      <PageHeader title={metadata.name}>
        <Button type="error" onClick={handleDelete}>
          DELETE
        </Button>
      </PageHeader>
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
