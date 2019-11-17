export const getPublicIP = loadBalancer => {
  if (loadBalancer && loadBalancer.ingress) return loadBalancer.ingress[0].ip;
  return null;
};
