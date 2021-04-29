import React from 'react';
import { getActiveJobs } from '../state-management/jobs-management';
import NewTableInfo from './NewTableInfo';

export default function CronJobs({ namespace, navigate }) {
  return (
    <NewTableInfo
      title="Cron Jobs"
      type="cronjobs"
      namespace={namespace}
      command="get cronjobs"
      navigate={navigate}
      formatHeader={() => [
        { id: 'name', label: 'Name', sorted: true },
        { id: 'schedule', label: 'Schedule' },
        { id: 'suspend', label: 'Suspend' },
        { id: 'active', label: 'Active' },
        { id: 'lastSchedule', label: 'Last Schedule' },
        { id: 'age', label: 'Age', align: 'right', sorted: true, type: 'date' }
      ]}
      formatItems={items =>
        items.map(({ metadata, status, spec }) => ({
          name: metadata.name,
          schedule: spec.schedule,
          suspend: spec.suspend.toString().toUpperCase(),
          active: getActiveJobs(status),
          lastSchedule: status.lastScheduleTime,
          age: metadata.creationTimestamp
        }))
      }
      dialogItems={[
        // { value: 'Info', type: 'cronjobs', href: 'get' },
        { value: 'Edit', type: 'cronjobs', href: 'edit' },
        { value: 'Describe', type: 'cronjobs', href: 'describe' }
      ]}
    />
  );
}
