import React from 'react';
import styled from '@emotion/styled';

import { getCompletedCount } from '../state-management/jobs-management';
import NewTableInfo from './NewTableInfo';

export default function Jobs({ namespace, navigate }) {
  return (
    <NewTableInfo
      title="Jobs"
      type="jobs"
      namespace={namespace}
      command="get jobs"
      navigate={navigate}
      formatHeader={() => [
        { id: 'name', label: 'Name', sorted: true },
        { id: 'completions', label: 'Completions' },
        { id: 'completion', label: 'Completion' },
        { id: 'age', label: 'Age', align: 'right', sorted: true, type: 'date' }
      ]}
      formatItems={items =>
        items.map(({ metadata, status, spec }) => ({
          name: metadata.name,
          completions: getCompletedCount(spec, status),
          completion: status.completionTime,
          age: metadata.creationTimestamp
        }))
      }
      dialogItems={[
        // { value: 'Info', type: 'jobs', href: 'get' },
        { value: 'Edit', type: 'jobs', href: 'edit' },
        { value: 'Describe', type: 'jobs', href: 'describe' }
      ]}
    />
  );
}
