import React, { useState } from 'react';
import { Redirect } from '@reach/router';
import { Global, css } from '@emotion/core';
import useAxios from '@use-hooks/axios';

import Home from './Home';
import Pods from './Pods';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AppContainer from '../components/AppContainer';
import CustomRouter from '../components/CustomRouter';
import Logs from './Logs';

function App() {
  const [links, setLinks] = useState([]);
  const { response } = useAxios({
    url: `${process.env.API}`,
    method: 'GET',
    trigger: null
  });

  const { data } = response || {};
  let namespaces = [];
  if (data) {
    namespaces = data.items.map(({ metadata }) => metadata.name);
  }

  const handleSidebarChange = newLink => {
    if (
      !links.find(
        link => link.type === newLink.type && link.name === newLink.name
      )
    )
      setLinks(links => links.concat(newLink));
  };

  return (
    <div>
      <Global
        styles={css`
          * {
            padding: 0 0;
            margin: 0 0;
            box-sizing: border-box;
            font-family: 'Roboto Mono', monospace;
          }
        `}
      />
      <Header />
      <AppContainer>
        <Sidebar namespaces={namespaces} links={links} />
        <CustomRouter>
          <Redirect from="/" to="/default" noThrow />
          <Home path="/:namespace" />
          <Pods path="/:namespace/pods" />
          <Logs
            path="/:namespace/pods/:name/logs/container/:selectedContainer"
            onLogInit={handleSidebarChange}
          />
        </CustomRouter>
      </AppContainer>
    </div>
  );
}

export default App;
