import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import useSWR from 'swr';

import * as kubectl from '../kubectl';
import Table from '../components/Table';
import {
  getPublicIP,
  getPorts,
  getPort
} from '../state-management/services-management';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import Input from '../components/Input';
import {
  storePid,
  formatPidKeyName,
  findPid,
  removePid
} from '../state-management/port-forward-management';
import Select from '../components/Select';
import setPrototypeOf from 'setprototypeof';
import DeleteButton from '../components/DeleteButton';

const ServiceType = styled.h3`
  margin-bottom: 16px;
`;

export default function ServiceInfo({ namespace, name, navigate }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [pid, setPid] = useState(0);
  const { data: response, error, isValidating, revalidate } = useSWR(
    [namespace, `get service ${name}`],
    kubectl.exec,
    { suspense: true }
  );

  useSWR([namespace, pid], kubectl.checkPortForward, {
    shouldRetryOnError: false,
    onError: () => {
      if (pid !== 0) {
        setPid(0);
        removePid(namespace, 'services', name);
      }
    }
  });

  useEffect(() => {
    let keyName = formatPidKeyName(namespace, 'services', name);
    let storedPidInfo = findPid(keyName);
    if (storedPidInfo) {
      setPid(storedPidInfo.pid);
      setFrom(storedPidInfo.from);
      setTo(storedPidInfo.to);
    }
  }, []);

  const handleEdit = () => {
    navigate(`/ui/${namespace}/services/${name}/edit`);
  };

  const handleDelete = () => {
    kubectl
      .exec(namespace, `delete service ${name}`, false)
      .then(() => navigate(`/ui/${namespace}/services`))
      .catch(err => console.error(err));
  };

  const handlePortSelection = event => setTo(event.target.value);

  const handlePortForward = () => {
    if (!from || !to) return;
    kubectl
      .portForward(namespace, 'services', name, from, to)
      .then(({ data: { yaml: pid } }) => {
        setPid(pid);
        storePid(namespace, 'services', name, pid, from, to);
      })
      .catch(err => console.error(err));
  };

  const handleStopPortForward = () => {
    kubectl
      .stopPortForward(namespace, pid)
      .then(() => {
        setPid(0);
        removePid(namespace, 'services', name);
      })
      .catch(err => console.error(err));
  };

  const {
    data: { metadata, spec, status }
  } = response || {};

  return (
    <div>
      <PageHeader title={metadata.name}>
        <Button onClick={handleEdit}>EDIT</Button>
        <DeleteButton name={metadata.name} onClick={handleDelete}>
          DELETE
        </DeleteButton>
      </PageHeader>
      <ServiceType>Type: {spec.type}</ServiceType>
      <Table>
        <thead>
          <tr>
            <th>Cluster IP</th>
            <th>Public IP</th>
            <th>Ports</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{spec.clusterIP}</td>
            <td>{getPublicIP(status.loadBalancer)}</td>
            <td>{getPorts(spec.ports)}</td>
          </tr>
        </tbody>
      </Table>
      <Table>
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Port-Forward</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Input
                type="text"
                placeholder="From"
                value={from}
                onChange={event => setFrom(+event.target.value)}
                disabled={pid}
              />
            </td>
            <td>
              <Select disabled={pid} value={to} onChange={handlePortSelection}>
                <option value={null}>Select Port</option>
                {spec.ports.map(portInfo => (
                  <option key={portInfo.port} value={portInfo.port}>
                    {getPort(portInfo)}
                  </option>
                ))}
              </Select>
            </td>
            <td>
              {!pid ? (
                <Button onClick={handlePortForward}>START</Button>
              ) : (
                <Button type="error" onClick={handleStopPortForward}>
                  STOP
                </Button>
              )}
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
