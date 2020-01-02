import React from 'react';
import { Link } from '@reach/router';

import Table from '../components/Table';
import TableInfo from './TableInfo';

export default function Pvc({ namespace }) {
  return (
    <TableInfo
      title="Persistent Volume Claims"
      namespace={namespace}
      command="get pvc"
    >
      {items => (
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Capacity</th>
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
                  <td>{status.phase}</td>
                  <td>{status.capacity && status.capacity.storage}</td>
                  <td>{metadata.creationTimestamp}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </TableInfo>
  );
}
