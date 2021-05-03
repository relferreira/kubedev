export function getContainersReady(spec, status) {
  let total = spec.containers.length;
  let ready = 0;
  if (status && status.containerStatuses)
    ready = status.containerStatuses.reduce(
      (prev, value) => prev + +value.ready,
      0
    );

  return `${ready}/${total}`;
}

export function getContainersRestarts(status) {
  let restarts = 0;
  if (status && status.containerStatuses)
    restarts = status.containerStatuses.reduce(
      (prev, value) => prev + +value.restartCount,
      0
    );

  return restarts;
}

export function getPodState(state) {
  switch (state) {
    case 'Succeeded':
      return 'primary';
    case 'Running':
      return 'secondary';
    case 'Failed':
      return 'danger';
    case 'Pending':
      return 'warning';
    case 'Unknown':
      return 'subdued';
    default:
      return 'subdued';
  }
}
