import useAxios from '@use-hooks/axios';

export const listDeployments = namespace =>
  useAxios({
    url: `${process.env.API}/${namespace}/deployments`,
    method: 'GET',
    trigger: namespace
  });
