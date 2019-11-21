export const getCondition = status => {
  if (status && status.conditions) return status.conditions[0]['type'];

  return null;
};

export const getNumberOfJobs = status => {
  return status && (status.succeeded || status.failed || status.running);
};

export const getActiveJobs = status =>
  (status && status.active && status.active.length) || 0;

export const getCompletedCount = (spec, status) => {
  let containers = 0;
  if (spec && spec.template && spec.template.spec)
    containers = spec.template.spec.containers.length;

  let completed = (status && +status.succeeded) || 0;

  return `${completed}/${containers}`;
};

//TODO
// export const getDuration = status =>
//   new Date(status.completionTime) - new Date(status.startTime);
