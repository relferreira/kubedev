import React from 'react';

import Table from '../components/Table';
import { getHosts } from '../state-management/ingress-management';
import TableInfo from './TableInfo';

export default function Ingress({ namespace }) {
  return (
    <TableInfo title="Ingress" namespace={namespace} command="get ingress">
      {items => (
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Host</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {items &&
              items.map(({ metadata, spec }) => (
                <tr key={metadata.name}>
                  <td>
                    {metadata.name}
                    {/* <Link to={`${metadata.name}/get`}>{metadata.name}</Link> */}
                  </td>
                  <td>{getHosts(spec)}</td>
                  <td>{metadata.creationTimestamp}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </TableInfo>
  );
}
