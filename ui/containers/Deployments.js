import React from 'react';
import styled from '@emotion/styled';
import { Link } from '@reach/router';

import { useConfigContext } from '../state-management/config-management';
import DeployCard from '../components/DeployCard';
import Table from '../components/Table';
import TableInfo from './TableInfo';

const DeployGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

export default function Deployments({ namespace }) {
  const { config } = useConfigContext();

  return (
    <TableInfo
      title="Deployments"
      namespace={namespace}
      command="get deployments"
    >
      {items =>
        config.listStyle === 'table' ? (
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Ready</th>
                <th>Up to Date</th>
                <th>Available</th>
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
                    <td>
                      {spec.replicas && `${status.replicas}/${spec.replicas}`}
                    </td>
                    <td>{status.updatedReplicas}</td>
                    <td>{status.availableReplicas}</td>
                    <td>{metadata.creationTimestamp}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        ) : (
          <DeployGrid>
            {items &&
              items.map(({ metadata, status }) => (
                <DeployCard
                  key={metadata.name}
                  name={metadata.name}
                  replicas={status.replicas}
                />
              ))}
          </DeployGrid>
        )
      }
    </TableInfo>
  );
}
