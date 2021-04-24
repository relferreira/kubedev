import React from 'react';
import { getActiveJobs } from '../state-management/jobs-management';
import NewTableInfo from './NewTableInfo';

export default function CronJobs({ namespace, navigate }) {
  return (
    <NewTableInfo
      title="Cron Jobs"
      namespace={namespace}
      command="get cronjobs"
      navigate={navigate}
      formatHeader={() => [
        'Name',
        'Schedule',
        'Suspend',
        'Active',
        'Last Schedule',
        'Age'
      ]}
      formatItems={items =>
        items.map(({ metadata, status, spec }) => [
          metadata.name,
          spec.schedule,
          spec.suspend.toString().toUpperCase(),
          getActiveJobs(status),
          status.lastScheduleTime,
          metadata.creationTimestamp
        ])
      }
      dialogItems={[
        // { value: 'Info', type: 'cronjobs', href: 'get' },
        { value: 'Edit', type: 'cronjobs', href: 'edit' },
        { value: 'Describe', type: 'cronjobs', href: 'describe' }
      ]}
    />
  );
}
