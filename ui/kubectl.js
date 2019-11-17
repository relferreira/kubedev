import axios from 'axios';

export const exec = (namespace, command, json = true) => {
  let url = `${process.env.API}/${namespace}/exec`;
  return axios.get(url, { params: { command, json } });
};

export const apply = (namespace, json) =>
  axios.post(`${process.env.API}/${namespace}/apply`, json);
