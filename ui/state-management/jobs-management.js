import useAxios from '@use-hooks/axios';
import axios from 'axios';

export const listJobs = namespace =>
  useAxios({
    url: `${process.env.API}/${namespace}/jobs`,
    method: 'GET',
    trigger: namespace
  });

export const getCondition = status => {
  if (status && status.conditions) return status.conditions[0]['type'];

  return null;
};

export const getNumberOfJobs = status => {
  return status && (status.succeeded || status.failed || status.running);
};
