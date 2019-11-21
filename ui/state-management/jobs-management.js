export const getCondition = status => {
  if (status && status.conditions) return status.conditions[0]['type'];

  return null;
};

export const getNumberOfJobs = status => {
  return status && (status.succeeded || status.failed || status.running);
};

export const getActiveJobs = status =>
  (status && status.active && status.active.length) || 0;
