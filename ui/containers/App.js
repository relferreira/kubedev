import React, { useState } from 'react';
import { Link, Router } from '@reach/router';
import { Global, css } from '@emotion/core';
import styled from '@emotion/styled';

import Home from './Home';
import Pods from './Pods';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AppContainer from '../components/AppContainer';
import CustomRouter from '../components/CustomRouter';
import Logs from './Logs';

function App() {
  const [links, setLinks] = useState([]);
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
        <Sidebar links={links} />
        <CustomRouter>
          <Home path="/" />
          <Pods path="/pods" />
          <Logs
            path="/pods/:name/logs/container/:selectedContainer"
            onLogInit={handleSidebarChange}
          />
        </CustomRouter>
      </AppContainer>
    </div>
  );
}

export default App;
