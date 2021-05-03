import * as kubectl from '../kubectl';

self.onmessage = e => {
  Promise.all([
    kubectl.exec('all-namespaces', 'get services'),
    kubectl.exec('all-namespaces', 'get deployments'),
    // kubectl.exec('all-namespaces', 'get pods'),
    kubectl.exec('all-namespaces', 'get cronjobs'),
    kubectl.exec('all-namespaces', 'get jobs')
  ])
    .then(([services, deployments, cronjobs, jobs]) =>
      self.postMessage({
        id: new Date(),
        services: services.data,
        deployments: deployments.data,
        cronjobs: cronjobs.data,
        jobs: jobs.data
      })
    )
    .catch(console.error);
};
