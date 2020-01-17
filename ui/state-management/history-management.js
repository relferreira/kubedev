const STORAGE_KEY = 'kubedev-history';

export function getHistory() {
  let historyStr = localStorage && localStorage.getItem(STORAGE_KEY);
  return historyStr ? JSON.parse(historyStr) : [];
}

export function addHistory(info) {
  let storedHistory = getHistory();

  if (!storedHistory) storedHistory = [];

  Object.keys(info).forEach(key => !info[key] && delete info[key]);

  storedHistory.push({ ...info, date: new Date() });

  storedHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

  storedHistory = storedHistory
    .filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          t =>
            t.namespace === item.namespace &&
            t.type === item.type &&
            t.name === item.name &&
            t.action === item.action
        )
    )
    .slice(0, 100);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storedHistory));
}
