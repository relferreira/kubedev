import useAxios from '@use-hooks/axios';

export const listPods = namespace =>
  useAxios({
    url: `${process.env.API}/${namespace}/pods`,
    method: 'GET',
    trigger: namespace
  });

export const getPodInfo = (namespace, name) =>
  useAxios({
    url: `${process.env.API}/${namespace}/pods/${name}`,
    method: 'GET',
    trigger: namespace
  });
