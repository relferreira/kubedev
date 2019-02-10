import useAxios from '@use-hooks/axios';

export const listServices = namespace =>
  useAxios({
    url: `${process.env.API}/${namespace}/services`,
    method: 'GET',
    trigger: namespace
  });

export const getServiceInfo = (namespace, name) =>
  useAxios({
    url: `${process.env.API}/${namespace}/services/${name}`,
    method: 'GET',
    trigger: namespace
  });

export const getPublicIP = loadBalancer => {
  if (loadBalancer && loadBalancer.ingress) return loadBalancer.ingress[0].ip;
  return null;
};
