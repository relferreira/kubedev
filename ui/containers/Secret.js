import React from 'react';
import { Link } from '@reach/router';

import Table from '../components/Table';
import TableInfo from './TableInfo';

export default function Secret({ namespace }) {
  return (
    <TableInfo title="Secrets" namespace={namespace} command="get secrets">
      {items => (
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Data</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {items &&
              items.map(({ data, metadata, type }) => (
                <tr key={metadata.name}>
                  <td>
                    <Link to={`${metadata.name}/get`}>{metadata.name}</Link>
                  </td>
                  <td>{type}</td>
                  <td>{data && Object.keys(data).length}</td>
                  <td>{metadata.creationTimestamp}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </TableInfo>
  );
}
