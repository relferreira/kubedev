export const getMetrics = metadata => {
  try {
    let currentMetrics = JSON.parse(
      metadata.annotations['autoscaling.alpha.kubernetes.io/current-metrics']
    );
    let metrics = JSON.parse(
      metadata.annotations['autoscaling.alpha.kubernetes.io/metrics']
    );

    let currentMetric = currentMetrics[0]['external']['currentValue'];
    let metric = metrics[0]['external']['targetValue'];

    return `${currentMetric}/${metric}`;
  } catch (e) {
    return null;
  }
};
