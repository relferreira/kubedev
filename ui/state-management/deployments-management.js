import useAxios from '@use-hooks/axios';

export const listDeployments = namespace =>
  useAxios({
    url: `${process.env.API}/${namespace}/deployments`,
    method: 'GET',
    trigger: namespace
  });

export const getDeployment = (namespace, name) =>
  useAxios({
    url: `${process.env.API}/${namespace}/deployments/${name}`,
    method: 'GET',
    trigger: namespace
  });
