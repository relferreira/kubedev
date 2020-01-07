import React from 'react';
import { Link } from '@reach/router';

import Table from '../components/Table';
import {
  getNodeStatus,
  getNodeKubernetesVersion,
  getNodeRole
} from '../state-management/node-management';
import TableInfo from './TableInfo';

export default function Nodes({ namespace }) {
  return (
    <TableInfo title="Nodes" namespace={namespace} command="get nodes">
      {items => (
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Roles</th>
              <th>Version</th>
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
                  <td>{getNodeStatus(status)}</td>
                  <td>{getNodeRole(metadata)}</td>
                  <td>{getNodeKubernetesVersion(status)}</td>
                  <td>{metadata.creationTimestamp}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </TableInfo>
  );
}
