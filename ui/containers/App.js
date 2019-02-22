import React, { useState } from 'react';
import { Redirect } from '@reach/router';
import { Global, css } from '@emotion/core';
import { ThemeProvider } from 'emotion-theming';
import useAxios from '@use-hooks/axios';

import Home from './Home';
import Pods from './Pods';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AppContainer from '../components/AppContainer';
import CustomRouter from '../components/CustomRouter';
import Logs from './Logs';
import PodInfo from './PodInfo';
import {
  primary,
  primaryDark,
  darkLight,
  darkDark,
  primaryLight,
  fontColor,
  fontColorWhite,
  fontColorDark,
  cardBackgroundLight,
  cardBackgroundDark,
  backgroundLight,
  tableBorderLight,
  tableBorderDark
} from '../util/colors';
import Deployments from './Deployments';
import Services from './Services';
import ServiceInfo from './ServiceInfo';
import DeploymentInfo from './DeploymentInfo';

const lightTheme = {
  name: 'light',
  background: backgroundLight,
  header: primaryDark,
  sidebarBackground: primaryLight,
  sidebarFontColor: fontColor,
  containerFont: fontColorDark,
  cardBackground: cardBackgroundLight,
  tableBorder: tableBorderLight,
  controllerBackground: backgroundLight,
  controllerColor: fontColor,
  controllerBorder: fontColor
};

const darkTheme = {
  name: 'dark',
  background: darkDark,
  header: darkLight,
  sidebarBackground: darkDark,
  sidebarFontColor: fontColorWhite,
  containerFont: fontColorWhite,
  cardBackground: cardBackgroundDark,
  tableBorder: tableBorderDark,
  controllerBackground: darkLight,
  controllerColor: fontColorWhite,
  controllerBorder: tableBorderLight
};

function App() {
  const [theme, setTheme] = useState(darkTheme);
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

  const handleThemeChange = () => {
    setTheme(theme => (theme.name === 'light' ? darkTheme : lightTheme));
  };

  return (
    <ThemeProvider theme={theme}>
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
        <Sidebar
          namespaces={namespaces}
          links={links}
          onThemeChange={handleThemeChange}
        />
        <CustomRouter>
          <Redirect from="/" to="/default" noThrow />
          <Home path="/:namespace" />
          <Services path="/:namespace/services" />
          <ServiceInfo path="/:namespace/services/:name/info" />
          <Deployments path="/:namespace/deployments" />
          <DeploymentInfo path="/:namespace/deployments/:name/info" />
          <Pods path="/:namespace/pods" />
          <PodInfo path="/:namespace/pods/:name/info" />
          <Logs
            path="/:namespace/pods/:name/logs/container/:selectedContainer"
            onLogInit={handleSidebarChange}
          />
        </CustomRouter>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
