import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiToolTip,
  EuiButtonIcon,
  EuiFieldText,
  EuiGlobalToastList,
  EuiTitle
} from '@elastic/eui';

import NewTableInfo from './NewTableInfo';
import * as kubectl from '../kubectl';
import Table from '../components/Table';
import * as componentProps from './configs';

export default function DeploymentInfo({ namespace, name, navigate }) {
  let type = 'deployments';
  const [toasts, setToasts] = useState([]);
  const [scale, setScale] = useState('');
  const {
    data: {
      data: { metadata, spec, status }
    },
    error,
    isValidating,
    revalidate
  } = useSWR(
    [namespace, `get ${type} ${name}`],
    (namespace, command) => kubectl.exec(namespace, command, true),
    {
      suspense: true
    }
  );

  const handleScale = () => {
    kubectl
      .exec(namespace, `scale ${type} ${name} --replicas=${scale}`, false)
      .then(() => {
        setToasts([
          {
            title: 'Deployment scaled!',
            color: 'success',
            iconType: 'check'
          }
        ]);
        revalidate();
        // revalidatePods();
      })
      .catch(() =>
        setToasts([
          {
            title: 'Error scaling deployment!',
            color: 'danger',
            iconType: 'alert'
          }
        ])
      );
  };

  const handleDelete = () => {
    kubectl
      .exec(namespace, `delete ${type} ${name}`, false)
      .then(() => {
        setToasts([
          {
            title: 'Deployment deleted!',
            color: 'success',
            iconType: 'check'
          }
        ]);
        navigate(`/ui/${namespace}/${type}`);
      })
      .catch(err => {
        setToasts([
          {
            title: 'Error deleting deployment!',
            color: 'danger',
            iconType: 'alert'
          }
        ]);
      });
  };

  const handleEdit = () => {
    navigate(`/ui/${namespace}/${type}/${name}/edit`);
  };

  const handleRefresh = () => {
    revalidate();
  };

  useMemo(() => setScale(spec.replicas), [spec.replicas]);

  let compProps = componentProps['pods'];

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
          <EuiTitle>
            <h1>Deployment: {metadata.name}</h1>
          </EuiTitle>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiFlexGroup direction="row" gutterSize="s">
            <EuiFlexItem>
              <EuiToolTip position="bottom" content="Save">
                <EuiButtonIcon
                  size="m"
                  iconSize="m"
                  color="text"
                  iconType="save"
                  aria-label="Save"
                  onClick={handleScale}
                />
              </EuiToolTip>
            </EuiFlexItem>
            {/* <EuiFlexItem>
              <EuiToolTip position="bottom" content="Refresh">
                <EuiButtonIcon
                  size="m"
                  iconSize="m"
                  color="text"
                  iconType="refresh"
                  aria-label="Edit"
                  onClick={handleRefresh}
                />
              </EuiToolTip>
            </EuiFlexItem> */}
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
      <EuiSpacer size="l" />
      <Table
        isSelectable={false}
        showCheckbox={false}
        isSortable={false}
        columns={[
          { id: 'replicas', label: 'Replicas' },
          { id: 'readyReplicas', label: 'Ready Replicas' },
          { id: 'availableReplicas', label: 'Available Replicas' },
          { id: 'updatedReplicas', label: 'Updated Replicas' }
        ]}
        items={[
          {
            replicas: (
              <EuiFieldText
                type="text"
                placeholder="Replicas"
                value={scale}
                onChange={event => setScale(+event.target.value)}
              />
            ),
            readyReplicas: status.readyReplicas,
            availableReplicas: status.availableReplicas,
            updatedReplicas: status.updatedReplicas
          }
        ]}
      />
      <EuiSpacer size="l" />
      {spec && (
        <NewTableInfo
          title="Pods"
          type="pods"
          namespace={namespace}
          command={`get pods -l=app=${spec.selector.matchLabels.app}`}
          navigate={navigate}
          {...compProps}
        />
      )}
      <EuiGlobalToastList
        toasts={toasts}
        dismissToast={() => setToasts([])}
        toastLifeTimeMs={6000}
      />
    </div>
  );
}
