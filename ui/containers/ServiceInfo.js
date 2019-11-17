import React from 'react';
import styled from '@emotion/styled';
import useSWR from 'swr';

import * as kubectl from '../kubectl';
import Table from '../components/Table';
import { getPublicIP } from '../state-management/services-management';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';

const ServiceType = styled.h3`
  margin-bottom: 16px;
`;

export default function ServiceInfo({ namespace, name, navigate }) {
  // const { response, loading } = getServiceInfo(namespace, name);

  const { data: response, error, isValidating, revalidate } = useSWR(
    [namespace, `get service ${name}`],
    kubectl.exec,
    { suspense: true }
  );

  const handleDelete = () => {
    kubectl
      .exec(namespace, `delete service ${name}`, false)
      .then(() => navigate(`/${namespace}/services`))
      .catch(err => console.error(err));
  };

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
