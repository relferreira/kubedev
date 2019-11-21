import React, { useState } from 'react';
import constate from 'constate';

const STORAGE_KEY = 'kubedev-config';

const initialConfig = {
  theme: 'dark',
  listStyle: 'table'
};

export function getStoredConfig() {
  let configStr = localStorage && localStorage.getItem(STORAGE_KEY);
  return configStr && JSON.parse(configStr);
}

function useConfig({ defaultConfig }) {
  if (!defaultConfig) {
    defaultConfig = initialConfig;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultConfig));
  }
  const [config, setConfig] = useState(defaultConfig);
  const changeConfig = newConfig => {
    newConfig = { ...config, ...newConfig };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    setConfig(newConfig);
  };
  return { config, changeConfig };
}

const [ConfigProvider, useConfigContextAux] = constate(useConfig);

export const useConfigContext = useConfigContextAux;

export default ConfigProvider;
