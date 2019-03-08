import useAxios from '@use-hooks/axios';
import axios from 'axios';

export const listJobs = namespace =>
  useAxios({
    url: `${process.env.API}/${namespace}/jobs`,
    method: 'GET',
    trigger: namespace
  });

export const getJobInfo = (namespace, name) =>
  useAxios({
    url: `${process.env.API}/${namespace}/jobs/${name}`,
    method: 'GET',
    trigger: namespace
  });

export const deleteJob = (namespace, name) =>
  axios.delete(`${process.env.API}/${namespace}/jobs/${name}`);

export const listCronJobs = namespace =>
  useAxios({
    url: `${process.env.API}/${namespace}/cron-jobs`,
    method: 'GET',
    trigger: namespace
  });

export const getCronJob = (namespace, name, handler) =>
  useAxios({
    url: `${process.env.API}/${namespace}/cron-jobs/${name}`,
    method: 'GET',
    trigger: namespace,
    customHandler: handler
  });

export const deleteCronJob = (namespace, name, schedule) =>
  axios.delete(`${process.env.API}/${namespace}/cron-jobs/${name}`);

export const scheduleCronJob = (namespace, name, schedule) =>
  axios.post(`${process.env.API}/${namespace}/cron-jobs/${name}/schedule`, {
    schedule
  });

export const getCondition = status => {
  if (status && status.conditions) return status.conditions[0]['type'];

  return null;
};

export const getNumberOfJobs = status => {
  return status && (status.succeeded || status.failed || status.running);
};
