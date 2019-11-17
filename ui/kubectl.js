import axios from 'axios';

export const exec = (namespace, command, json = true) => {
  let url = `${process.env.API}/${namespace}/get`;
  return axios.get(url, { params: { command, json } });
};
// useAxios({
//   url: `${process.env.API}/${namespace}/get`,
//   method: 'GET',
//   trigger: namespace,
//   options: {
//     params: {
//       command
//     }
//   },
//   customHandler: handler
// });

export const apply = (namespace, json) =>
  axios.post(`${process.env.API}/${namespace}/apply`, json);
