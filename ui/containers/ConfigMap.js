import React from 'react';

import Table from '../components/Table';
import TableInfo from './TableInfo';

export default function ConfigMap({ namespace }) {
  return (
    <TableInfo
      title="Config Maps"
      namespace={namespace}
      command="get configmaps"
    >
      {items => (
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Data</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {items &&
              items.map(({ data, metadata }) => (
                <tr key={metadata.name}>
                  <td>
                    {metadata.name}
                    {/* <Link to={`${metadata.name}/get`}>{metadata.name}</Link> */}
                  </td>
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
