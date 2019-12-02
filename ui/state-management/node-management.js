export const getNodeStatus = status => {
  try {
    let { conditions } = status;
    return conditions[conditions.length - 1]['type'];
  } catch (e) {
    return null;
  }
};

export const getNodeKubernetesVersion = status => {
  try {
    let {
      nodeInfo: { kubeletVersion }
    } = status;
    return kubeletVersion;
  } catch (e) {
    return null;
  }
};

export const getNodeRole = metadata => {
  try {
    let { labels } = metadata;
    return labels['kubernetes.azure.com/role'];
  } catch (e) {
    return null;
  }
};
