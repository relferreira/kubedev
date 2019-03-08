import React, { useState } from 'react';
import styled from '@emotion/styled';

import PageHeader from '../components/PageHeader';
import {
  getCronJob,
  scheduleCronJob,
  deleteCronJob
} from '../state-management/jobs-management';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';

const CustomTable = styled(Table)`
  margin-top: 5px;
`;

const CustomInput = styled(Input)`
  font-size: 14px;
`;

export default function CronJobInfo({ namespace, name, navigate }) {
  const [schedule, setSchedule] = useState('');
  const { response, loading, query } = getCronJob(
    namespace,
    name,
    (err, response) => {
      if (response) setSchedule(response.data.spec.schedule);
    }
  );

  const handleSchedule = () => {
    scheduleCronJob(namespace, name, schedule)
      .then(() => query())
      .catch(err => console.error(err));
  };

  const handleDelete = () => {
    deleteCronJob(namespace, name)
      .then(() => navigate('../'))
      .catch(err => console.error(err));
  };

  if (loading) return <div>Loading...</div>;

  if (!response) return null;

  const {
    data: { metadata, spec, status }
  } = response || {};

  return (
    <div>
      <PageHeader title={metadata.name}>
        <Button type="error" onClick={handleDelete}>
          DELETE
        </Button>
        <Button onClick={handleSchedule}>SAVE</Button>
      </PageHeader>
      <CustomTable>
        <thead>
          <tr>
            <th>Schedule</th>
            <th>Schedule Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <CustomInput
                type="text"
                placeholder="Schedule"
                value={schedule}
                onChange={event => setSchedule(event.target.value)}
              />
            </td>
            <td>{status.lastScheduleTime}</td>
          </tr>
        </tbody>
      </CustomTable>
    </div>
  );
}
