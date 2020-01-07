export const getPublicIP = loadBalancer => {
  if (loadBalancer && loadBalancer.ingress) return loadBalancer.ingress[0].ip;
  return null;
};

export const getPorts = ports =>
  ports && ports.map(portInfo => getPort(portInfo)).join(',');

export const getPort = portInfo => `${portInfo.port}/${portInfo.protocol}`;
