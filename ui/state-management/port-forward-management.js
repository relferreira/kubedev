const STORAGE_KEY = 'kubedev-port-forward';

export function getStoredPids() {
  let pidsStr = localStorage && localStorage.getItem(STORAGE_KEY);
  return pidsStr && JSON.parse(pidsStr);
}

export function storePid(namespace, type, name, pid, from, to) {
  let formatedName = formatPidKeyName(namespace, type, name);
  let storedPids = getStoredPids();
  let newPids = { ...storedPids, [formatedName]: { pid, from, to } };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(newPids));
}

export function findPid(name) {
  let storedPids = getStoredPids();

  return storedPids[name];
}

export function formatPidKeyName(namespace, type, name) {
  return `${namespace} ${type}/${name}`;
}

export function removePid(namespace, type, name) {
  let formatedName = formatPidKeyName(namespace, type, name);
  let storedPids = getStoredPids();

  let { [formatedName]: storedName, ...others } = storedPids;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(others));
}
