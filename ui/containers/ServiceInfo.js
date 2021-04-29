import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiToolTip,
  EuiButtonIcon,
  EuiFieldText,
  EuiSelect,
  EuiSpacer
} from '@elastic/eui/';

import * as kubectl from '../kubectl';
import Table from '../components/Table';
import {
  getPublicIP,
  getPorts,
  getPort
} from '../state-management/services-management';
import {
  storePid,
  formatPidKeyName,
  findPid,
  removePid
} from '../state-management/port-forward-management';

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
      <EuiFlexGroup
        direction="row"
        alignItems="center"
        gutterSize="none"
        responsive={false}
        wrap={true}
      >
        <EuiFlexItem>
          <h1>Service: {metadata.name}</h1>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiFlexGroup direction="row" gutterSize="s">
            <EuiFlexItem>
              <EuiToolTip position="bottom" content="Edit">
                <EuiButtonIcon
                  size="m"
                  iconSize="m"
                  color="text"
                  iconType="documentEdit"
                  aria-label="Edit"
                  onClick={handleEdit}
                />
              </EuiToolTip>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiToolTip position="bottom" content="Delete">
                <EuiButtonIcon
                  size="m"
                  iconSize="m"
                  iconType="trash"
                  color="danger"
                  aria-label="Delete"
                  name={metadata.name}
                  onClick={handleDelete}
                />
              </EuiToolTip>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>
      <span>Type: {spec.type}</span>
      <EuiSpacer />
      <Table
        isSelectable={false}
        showCheckbox={false}
        isSortable={false}
        columns={[
          { id: 'clusterIp', label: 'Cluster IP' },
          { id: 'publicIp', label: 'Public IP' },
          { id: 'ports', label: 'Ports' }
        ]}
        items={[
          {
            clusterIp: spec.clusterIP,
            publicIp: getPublicIP(status.loadBalancer),
            ports: getPorts(spec.ports)
          },
          {
            clusterIp: (
              <EuiFieldText
                type="text"
                placeholder="From"
                value={from}
                onChange={event => setFrom(+event.target.value)}
                disabled={pid}
              />
            ),
            publicIp: (
              <EuiSelect
                disabled={pid}
                value={to}
                options={[{ text: 'Select port', value: '' }].concat(
                  spec.ports.map(portInfo => ({
                    value: portInfo.port,
                    text: getPort(portInfo)
                  }))
                )}
                onChange={handlePortSelection}
              />
            ),
            ports: !pid ? (
              <EuiToolTip position="bottom" content="Port Forward">
                <EuiButtonIcon
                  color="success"
                  iconType="play"
                  aria-label="Start Port-forward"
                  onClick={handlePortForward}
                />
              </EuiToolTip>
            ) : (
              <EuiToolTip position="bottom" content="Stop Port Forward">
                <EuiButtonIcon
                  color="danger"
                  iconType="pause"
                  aria-label="Stop Port-forward"
                  onClick={handleStopPortForward}
                />
              </EuiToolTip>
            )
          }
        ]}
      />
    </div>
  );
}
