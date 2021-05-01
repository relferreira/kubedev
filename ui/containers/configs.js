import React from 'react';
import { EuiBadge } from '@elastic/eui';
import {
  getContainersReady,
  getContainersRestarts,
  getPodState
} from '../state-management/pod-management';
import { getPorts, getPublicIP } from '../state-management/services-management';
import {
  getActiveJobs,
  getCompletedCount
} from '../state-management/jobs-management';
import {
  getNodeKubernetesVersion,
  getNodeRole,
  getNodeStatus
} from '../state-management/node-management';
import { getHosts } from '../state-management/ingress-management';
import { getMetrics } from '../state-management/hpa-management';

export const pods = {
  filterFields: ['metadata.name', 'status.phase'],
  formatHeader: () => [
    { id: 'name', label: 'Name', sorted: true },
    { id: 'ready', label: 'Ready', align: 'center' },
    {
      id: 'status',
      label: 'Status',
      align: 'center',
      render: status => (
        <EuiBadge color={getPodState(status)}>{status}</EuiBadge>
      )
    },
    { id: 'restarts', label: 'Restarts', align: 'center' },
    {
      id: 'age',
      label: 'Age',
      align: 'right',
      sorted: true,
      type: 'date'
    }
  ],
  formatItems: items =>
    items.map(({ metadata, status, spec }) => ({
      name: metadata.name,
      ready: getContainersReady(spec, status),
      status: status.phase,
      restarts: getContainersRestarts(status),
      age: metadata.creationTimestamp
    })),
  dialogItems: [
    { value: 'Logs', type: 'pods', href: 'logs' },
    { value: 'Edit', type: 'pods', href: 'edit' },
    // { value: 'Info', type: 'pods', href: 'get' },
    { value: 'Describe', type: 'pods', href: 'describe' }
  ]
};

export const services = {
  formatHeader: () => [
    { id: 'name', label: 'Name', sorted: true },
    { id: 'type', label: 'Type' },
    { id: 'clusterIP', label: 'Cluster IP' },
    { id: 'externalIP', label: 'External IP' },
    { id: 'port', label: 'Port(s)' },
    { id: 'age', label: 'Age', align: 'right', sorted: true, type: 'date' }
  ],
  formatItems: items =>
    items.map(({ metadata, status, spec }) => ({
      name: metadata.name,
      type: spec.type,
      clusterIP: spec.clusterIP,
      externalIP: getPublicIP(status.loadBalancer),
      port: getPorts(spec.ports),
      age: metadata.creationTimestamp
    })),
  dialogItems: [
    { value: 'Port Forward', type: 'services', href: 'get' },
    // { value: 'Info', type: 'services', href: 'get' },
    { value: 'Edit', type: 'services', href: 'edit' },
    { value: 'Describe', type: 'services', href: 'describe' }
  ]
};

export const jobs = {
  formatHeader: () => [
    { id: 'name', label: 'Name', sorted: true },
    { id: 'completions', label: 'Completions' },
    {
      id: 'completionTime',
      label: 'Completion'
    },
    { id: 'age', label: 'Age', align: 'right', sorted: true, type: 'date' }
  ],
  formatItems: items =>
    items.map(({ metadata, status, spec }) => ({
      name: metadata.name,
      completions: getCompletedCount(spec, status),
      completionTime: status.completionTime,
      age: metadata.creationTimestamp
    })),

  dialogItems: [
    // { value: 'Info', type: 'jobs', href: 'get' },
    { value: 'Edit', type: 'jobs', href: 'edit' },
    { value: 'Describe', type: 'jobs', href: 'describe' }
  ]
};

export const cronjobs = {
  formatHeader: () => [
    { id: 'name', label: 'Name', sorted: true },
    { id: 'schedule', label: 'Schedule' },
    { id: 'suspend', label: 'Suspend' },
    { id: 'active', label: 'Active' },
    { id: 'lastSchedule', label: 'Last Schedule' },
    { id: 'age', label: 'Age', align: 'right', sorted: true, type: 'date' }
  ],
  formatItems: items =>
    items.map(({ metadata, status, spec }) => ({
      name: metadata.name,
      schedule: spec.schedule,
      suspend: spec.suspend.toString().toUpperCase(),
      active: getActiveJobs(status),
      lastSchedule: status.lastScheduleTime,
      age: metadata.creationTimestamp
    })),
  dialogItems: [
    // { value: 'Info', type: 'cronjobs', href: 'get' },
    { value: 'Edit', type: 'cronjobs', href: 'edit' },
    { value: 'Describe', type: 'cronjobs', href: 'describe' }
  ]
};

export const nodes = {
  formatHeader: () => [
    { id: 'name', label: 'Name', sorted: true },
    { id: 'status', label: 'Status' },
    { id: 'roles', label: 'Roles' },
    { id: 'version', label: 'Version' },
    { id: 'age', label: 'Age', align: 'right', sorted: true, type: 'date' }
  ],
  formatItems: items =>
    items.map(({ metadata, status, spec }) => ({
      name: metadata.name,
      status: getNodeStatus(status),
      roles: getNodeRole(metadata),
      version: getNodeKubernetesVersion(status),
      age: metadata.creationTimestamp
    })),
  dialogItems: [
    // { value: 'Info', type: 'cronjobs', href: 'get' },
    { value: 'Edit', type: 'nodes', href: 'edit' },
    { value: 'Describe', type: 'nodes', href: 'describe' }
  ]
};

export const ingress = {
  formatHeader: () => [
    { id: 'name', label: 'Name', sorted: true },
    { id: 'host', label: 'Host' },
    { id: 'age', label: 'Age', align: 'right', sorted: true, type: 'date' }
  ],
  formatItems: items =>
    items.map(({ metadata, spec }) => ({
      name: metadata.name,
      host: getHosts(spec),
      age: metadata.creationTimestamp
    })),
  dialogItems: [
    { value: 'Describe', type: 'ingress', href: 'describe' },
    { value: 'Edit', type: 'ingress', href: 'edit' }
  ]
};

export const hpa = {
  formatHeader: () => [
    { id: 'name', label: 'Name', sorted: true },
    { id: 'targets', label: 'Targets' },
    { id: 'min', label: 'Min' },
    { id: 'max', label: 'Max' },
    { id: 'replicas', label: 'Replicas' },
    { id: 'age', label: 'Age', align: 'right', sorted: true, type: 'date' }
  ],
  formatItems: items =>
    items.map(({ metadata, status, spec }) => ({
      name: metadata.name,
      targets: getMetrics(metadata),
      min: spec.minReplicas,
      max: spec.maxReplicas,
      replicas: status.currentReplicas,
      age: metadata.creationTimestamp
    })),
  dialogItems: [
    // { value: 'Info', type: 'hpa', href: 'get' },
    { value: 'Describe', type: 'hpa', href: 'describe' },
    { value: 'Edit', type: 'hpa', href: 'edit' }
  ]
};

export const pvc = {
  formatHeader: () => [
    { id: 'name', label: 'Name', sorted: true },
    { id: 'status', label: 'Status' },
    { id: 'capacity', label: 'Capacity' },
    { id: 'age', label: 'Age', align: 'right', sorted: true, type: 'date' }
  ],
  formatItems: items =>
    items.map(({ metadata, status }) => ({
      name: metadata.name,
      status: status.phase,
      capacity: status.capacity && status.capacity.storage,
      age: metadata.creationTimestamp
    })),
  dialogItems: [
    // { value: 'Info', type: 'pvc', href: 'get' },
    { value: 'Edit', type: 'pvc', href: 'edit' },
    { value: 'Describe', type: 'pvc', href: 'describe' }
  ]
};

export const configmaps = {
  formatHeader: () => [
    { id: 'name', label: 'Name', sorted: true },
    { id: 'data', label: 'Data' },
    { id: 'age', label: 'Age', align: 'right', sorted: true, type: 'date' }
  ],
  formatItems: items =>
    items.map(({ metadata, data }) => ({
      name: metadata.name,
      data: data && Object.keys(data).length,
      age: metadata.creationTimestamp
    })),
  dialogItems: [
    { value: 'Edit', type: 'configmaps', href: 'edit' },
    { value: 'Describe', type: 'configmaps', href: 'describe' }
  ]
};

export const secrets = {
  formatHeader: () => [
    { id: 'name', label: 'Name', sorted: true },
    { id: 'type', label: 'Type' },
    { id: 'data', label: 'Data' },
    { id: 'age', label: 'Age', align: 'right', sorted: true, type: 'date' }
  ],
  formatItems: items =>
    items.map(({ metadata, data, type }) => ({
      name: metadata.name,
      type: type,
      data: data && Object.keys(data).length,
      age: metadata.creationTimestamp
    })),
  dialogItems: [
    // { value: 'Info', type: 'secrets', href: 'get' },
    { value: 'Edit', type: 'secrets', href: 'edit' },
    { value: 'Describe', type: 'secrets', href: 'describe' }
  ]
};
