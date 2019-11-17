export const filterSearch = (data, search) => {
  if (data && data.items) {
    return data.items.filter(({ metadata }) =>
      metadata.name.startsWith(search)
    );
  }
  return [];
};

export const formatSearchResponse = info => {
  if (info) {
    return Object.keys(info)
      .map(key => {
        let items = info[key].items;

        return items.map(({ metadata: { name, namespace } }) => ({
          type: key,
          namespace,
          name
        }));
      })
      .reduce((a, b) => a.concat(b), []);
  }

  return [];
};

export const getSelectedNamespace = location => {
  let matches = location.pathname.split('/');
  if (matches && matches.length > 1) return matches[1];
  return '';
};
