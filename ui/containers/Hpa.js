import React from 'react';
import { Link } from '@reach/router';

import Table from '../components/Table';
import { getMetrics } from '../state-management/hpa-management';
import TableInfo from './TableInfo';

export default function Hpa({ namespace }) {
  return (
    <TableInfo
      title="Horizontal Pod Autoscaler"
      namespace={namespace}
      command="get hpa"
    >
      {items => (
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Targets</th>
              <th>Min</th>
              <th>Max</th>
              <th>Replicas</th>
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
                  <td>{getMetrics(metadata)}</td>
                  <td>{spec.minReplicas}</td>
                  <td>{spec.maxReplicas}</td>
                  <td>{status.currentReplicas}</td>
                  <td>{metadata.creationTimestamp}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </TableInfo>
  );
}
