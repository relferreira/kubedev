import useAxios from '@use-hooks/axios';
import axios from 'axios';

export const get = (namespace, command, handler) =>
  useAxios({
    url: `${process.env.API}/${namespace}/get`,
    method: 'GET',
    trigger: namespace,
    options: {
      params: {
        command
      }
    },
    customHandler: handler
  });

export const apply = (namespace, json) =>
  axios.post(`${process.env.API}/${namespace}/apply`, json);
