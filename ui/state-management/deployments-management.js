import useAxios from '@use-hooks/axios';
import axios from 'axios';

export const listDeployments = namespace =>
  useAxios({
    url: `${process.env.API}/${namespace}/deployments`,
    method: 'GET',
    trigger: namespace
  });

export const getDeployment = (namespace, name, handler) =>
  useAxios({
    url: `${process.env.API}/${namespace}/deployments/${name}`,
    method: 'GET',
    trigger: namespace,
    customHandler: handler
  });

export const scaleDeployment = (namespace, name, scale) =>
  axios.post(`${process.env.API}/${namespace}/deployments/${name}/scale`, {
    scale
  });
