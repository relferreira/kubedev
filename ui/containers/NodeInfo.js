import React from 'react';
import styled from '@emotion/styled';
import useSWR from 'swr';

import * as kubectl from '../kubectl';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import {
  getNodeStatus,
  getNodeRole,
  getNodeKubernetesVersion
} from '../state-management/node-management';

const CustomTable = styled(Table)`
  margin-top: 5px;
`;

export default function NodeInfo({ namespace, name, navigate }) {
  const { data: response } = useSWR(
    [namespace, `get node ${name}`],
    kubectl.exec,
    { suspense: true }
  );

  const {
    data: { metadata, status, spec }
  } = response || {};

  return (
    <div>
      <PageHeader title={name} />
      <CustomTable>
        <thead>
          <tr>
            <th>Status</th>
            <th>Roles</th>
            <th>Version</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{getNodeStatus(status)}</td>
            <td>{getNodeRole(metadata)}</td>
            <td>{getNodeKubernetesVersion(status)}</td>
            <td>{metadata.creationTimestamp}</td>
          </tr>
        </tbody>
      </CustomTable>
      <CustomTable>
        <thead>
          <tr>
            <th>CPU(cores)</th>
            <th>CPU%</th>
            <th>Memory(bytes)</th>
            <th>Memory%</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{getNodeStatus(status)}</td>
            <td>{getNodeRole(metadata)}</td>
            <td>{getNodeKubernetesVersion(status)}</td>
            <td>{metadata.creationTimestamp}</td>
          </tr>
        </tbody>
      </CustomTable>
    </div>
  );
}
