export const getHosts = spec =>
  spec && spec.rules && spec.rules.map(rule => rule.host).join(',');
