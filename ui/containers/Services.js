import React from 'react';
import styled from '@emotion/styled';
import { Link } from '@reach/router';

import { useConfigContext } from '../state-management/config-management';
import ServiceCard from '../components/ServiceCard';
import { getPublicIP, getPorts } from '../state-management/services-management';

import Table from '../components/Table';
import TableInfo from './TableInfo';

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

export default function Services({ namespace }) {
  const { config } = useConfigContext();

  return (
    <TableInfo title="Services" namespace={namespace} command="get services">
      {items =>
        config.listStyle === 'table' ? (
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Cluster IP</th>
                <th>External IP</th>
                <th>Port(s)</th>
                <th>Age</th>
              </tr>
            </thead>
            <tbody>
              {items &&
                items.map(({ metadata, status, spec }) => (
                  <tr key={metadata.name}>
                    <td>
                      <Link to={`${metadata.name}/get`}>{metadata.name}</Link>
                    </td>
                    <td>{spec.type}</td>
                    <td>{spec.clusterIP}</td>
                    <td>{getPublicIP(status.loadBalancer)}</td>
                    <td>{getPorts(spec.ports)}</td>
                    <td>{metadata.creationTimestamp}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        ) : (
          <ServicesGrid>
            {items &&
              items.map(({ metadata, spec, status }) => (
                <ServiceCard
                  key={metadata.name}
                  name={metadata.name}
                  clusterIP={spec.clusterIP}
                  publicIP={getPublicIP(status.loadBalancer)}
                />
              ))}
          </ServicesGrid>
        )
      }
    </TableInfo>
  );
}
