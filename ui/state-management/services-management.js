import useAxios from '@use-hooks/axios';
import axios from 'axios';

export const listServices = namespace =>
  useAxios({
    url: `${process.env.API}/${namespace}/services`,
    method: 'GET',
    trigger: namespace
  });

export const deleteService = (namespace, name) =>
  axios.delete(`${process.env.API}/${namespace}/services/${name}`);

export const getServiceInfo = (namespace, name) =>
  useAxios({
    url: `${process.env.API}/${namespace}/services/${name}`,
    method: 'GET',
    trigger: { namespace, name }
  });

export const getPublicIP = loadBalancer => {
  if (loadBalancer && loadBalancer.ingress) return loadBalancer.ingress[0].ip;
  return null;
};
