import useAxios from '@use-hooks/axios';
import axios from 'axios';

export const exec = (namespace, command) =>
  useAxios({
    url: `${process.env.API}/${namespace}/exec`,
    method: 'GET',
    trigger: namespace,
    options: {
      params: {
        command
      }
    }
  });
