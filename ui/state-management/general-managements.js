export const filterSearch = (data, search) => {
  if (data && data.items) {
    return data.items.filter(({ metadata }) =>
      metadata.name.startsWith(search)
    );
  }
  return [];
};

export const formatSearchResponse = (info, namespace, type) => {
  if (info) {
    return Object.keys(info)
      .filter(key => key !== 'id')
      .map(key => {
        let items = info[key].items;

        return items.map(({ metadata: { name, namespace } }) => ({
          type: key,
          namespace,
          name
        }));
      })
      .reduce((a, b) => a.concat(b), [])
      .filter(a => (namespace ? a.namespace === namespace : a))
      .filter(a => (type ? a.type === type : a));
  }

  return [];
};

export const getSelectedNamespace = location => {
  let matches = location.pathname.split('/');
  if (matches && matches.length > 2) return matches[2];
  return '';
};

export const formatSearchCommand = search => {
  let {
    newSearch: namespaceResultSearch = '',
    namespace
  } = getSearchCmdNamespace(search);

  let { newSearch: actionResultSearch = '', action } = getSearchCmdAction(
    namespaceResultSearch
  );
  let { newSearch: typeResultSearch = '', type } = getSearchCmdType(
    actionResultSearch
  );

  if (action === 'logs') {
    typeResultSearch = actionResultSearch;
    type = 'pods';
  }

  let name = getSearchCmdName(typeResultSearch);
  return { namespace, action, type, name };
};

export const getSearchCmdType = search => {
  if (!search) return {};
  let regex = /\b(svc|service|services|deployments|deployment|deploy|pods|pod|cronjobs|cronjob|jobs|job|statefulsets|statefulset|sts|hpa|pvc|nodes|node|ingress|configmaps|configmap|secrets|secret|scaledobjects|so)\b/;
  let matches = search.match(regex);
  if (matches) {
    let type = matches[1];

    let newSearch = search.replace(type, '').trim();

    type = type.replace(/^service$/, 'services');
    type = type.replace(/^svc$/, 'services');
    type = type.replace(/^deploy$/, 'deployments');
    type = type.replace(/^deployment$/, 'deployments');
    type = type.replace(/^pod$/, 'pods');
    type = type.replace(/^job$/, 'jobs');
    type = type.replace(/^cronjob$/, 'cronjobs');
    type = type.replace(/^statefulset$/, 'statefulsets');
    type = type.replace(/^sts$/, 'statefulsets');
    type = type.replace(/^node$/, 'nodes');
    type = type.replace(/^configmap$/, 'configmaps');
    type = type.replace(/^secret$/, 'secrets');

    return { newSearch, type };
  }

  return {};
};

export const getSearchCmdAction = search => {
  if (!search) return {};
  let regex = /get|edit|describe|logs/;
  let matches = search.match(regex);
  if (matches) {
    let action = matches[0];

    let newSearch = search.replace(action, '').trim();

    return { newSearch, action };
  }

  return {};
};

const getSearchCmdNamespace = search => {
  if (!search) return {};
  let regex = /-n\s(\S+)/;
  let matches = search.match(regex);
  if (matches) {
    let namespace = matches[1];

    let newSearch = search.replace(matches[0], '').replace(/\s+/, ' ').trim();
    return { newSearch, namespace };
  }

  return {};
};

export const getSearchCmdName = search => search.replace('kubectl', '').trim();

export const shouldRefreshSearch = id => {
  let now = new Date();
  let oldDate = id;
  let difference = now.getTime() - oldDate.getTime();
  let resultInMinutes = Math.round(difference / 60000);

  return resultInMinutes >= 1;
};

export const isSearchCommand = search => search.match('kubectl');
