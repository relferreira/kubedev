import React from 'react';
import { Link } from '@reach/router';

import Table from '../components/Table';
import TableInfo from './TableInfo';

export default function StatefulSets({ namespace }) {
  return (
    <TableInfo
      title="StatefulSets"
      namespace={namespace}
      command="get statefulsets"
    >
      {items => (
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Ready</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {items &&
              items.map(({ metadata, status }) => (
                <tr key={metadata.name}>
                  <td>
                    <Link to={`${metadata.name}/get`}>{metadata.name}</Link>
                  </td>
                  <td>{`${status.readyReplicas || 0}/${status.replicas}`}</td>
                  <td>{metadata.creationTimestamp}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </TableInfo>
  );
}
