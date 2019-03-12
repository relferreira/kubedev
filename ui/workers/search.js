import axios from 'axios';

self.onmessage = e => {
  axios
    .get(`${process.env.API}/all-namespaces/search`)
    .then(response => self.postMessage(JSON.stringify(response.data)))
    .catch(console.error);
};
