export const getPublicIP = loadBalancer => {
  if (loadBalancer && loadBalancer.ingress) return loadBalancer.ingress[0].ip;
  return null;
};

export const getPorts = ports =>
  ports.map(portInfo => `${portInfo.port}/${portInfo.protocol}`).join(',');
