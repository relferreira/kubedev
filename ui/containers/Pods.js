import React from 'react';
import styled from '@emotion/styled';
import { Link } from '@reach/router';

import { useConfigContext } from '../state-management/config-management';
import PodCard from '../components/PodCard';
import Table from '../components/Table';
import {
  getContainersReady,
  getContainersRestarts
} from '../state-management/pod-management';
import TableInfo from './TableInfo';

const PodsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
`;

export default function Pods({ namespace }) {
  const { config } = useConfigContext();

  return (
    <TableInfo title="Pods" namespace={namespace} command="get pods">
      {items =>
        config.listStyle === 'table' ? (
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Ready</th>
                <th>Status</th>
                <th>Restarts</th>
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
                    <td>{getContainersReady(spec, status)}</td>
                    <td>{status.phase}</td>
                    <td>{getContainersRestarts(status)}</td>
                    <td>{metadata.creationTimestamp}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        ) : (
          <PodsGrid>
            {items &&
              items.map(({ metadata, status }) => (
                <PodCard
                  key={metadata.name}
                  name={metadata.name}
                  state={status.phase}
                />
              ))}
          </PodsGrid>
        )
      }
    </TableInfo>
  );
}
