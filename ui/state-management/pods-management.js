import useAxios from '@use-hooks/axios';
import axios from 'axios';

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

export const deletePod = (namespace, name) =>
  axios.delete(`${process.env.API}/${namespace}/pods/${name}`);
