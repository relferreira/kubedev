import React from 'react';
import styled from '@emotion/styled';

import { getCompletedCount } from '../state-management/jobs-management';
import NewTableInfo from './NewTableInfo';

export default function Jobs({ namespace, navigate }) {
  return (
    <NewTableInfo
      title="Jobs"
      namespace={namespace}
      command="get jobs"
      navigate={navigate}
      formatHeader={() => ['Name', 'Completions', 'Completion', 'Age']}
      formatItems={items =>
        items.map(({ metadata, status, spec }) => [
          metadata.name,
          getCompletedCount(spec, status),
          status.completionTime,
          metadata.creationTimestamp
        ])
      }
      dialogItems={[
        // { value: 'Info', type: 'jobs', href: 'get' },
        { value: 'Edit', type: 'jobs', href: 'edit' },
        { value: 'Describe', type: 'jobs', href: 'describe' }
      ]}
    />
  );
}
