import axios from 'axios';

export const exec = (namespace, command, json = true) => {
  let url = `${process.env.API}/${namespace}/exec`;
  return axios.get(url, { params: { command, json } });
};

export const apply = (namespace, json) =>
  axios.post(`${process.env.API}/${namespace}/apply`, json);

export const portForward = (namespace, type, name, from, to) =>
  axios.get(
    `${process.env.API}/${namespace}/port-forward/start/${type}/${name}/${from}/${to}`
  );

export const stopPortForward = (namespace, pid) =>
  axios.get(`${process.env.API}/${namespace}/port-forward/stop/${pid}`);

export const checkPortForward = (namespace, pid) =>
  axios.get(`${process.env.API}/${namespace}/port-forward/running/${pid}`);
