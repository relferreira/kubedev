import React, { useState, Suspense, Fragment } from 'react';
import { Redirect, Location } from '@reach/router';
import { Global, css } from '@emotion/core';
import { ThemeProvider } from 'emotion-theming';
import useSWR from 'swr';
import Hotkeys from 'react-hot-keys';
import '@elastic/eui/dist/eui_theme_dark.css';

import * as kubectl from '../kubectl';
import Sidebar from '../components/Sidebar';
import Header from './Header';
import AppContainer from '../components/AppContainer';
import CustomRouter from '../components/CustomRouter';
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
  tableBorderDark,
  controllerBorderLight,
  controllerBorderDark
} from '../util/colors';
import ErrorBoundary from '../components/ErrorBoundary';
import RouterLoading from '../components/RouterLoading';
import ErrorLoading from '../components/ErrorLoading';

import { useConfigContext } from '../state-management/config-management';
import SearchDialog from '../components/SearchDialog';
import ScaledObjects from './ScaledObjects';
import { EuiPageTemplate, EuiFlexGroup, EuiPageSideBar } from '@elastic/eui';
import { appendIconComponentCache } from '@elastic/eui/es/components/icon/icon';

import { icon as EuiIconArrowUp } from '@elastic/eui/es/components/icon/assets/arrow_up';
import { icon as EuiIconArrowDown } from '@elastic/eui/es/components/icon/assets/arrow_down';
import { icon as EuiIconArrowLeft } from '@elastic/eui/es/components/icon/assets/arrow_left';
import { icon as EuiIconArrowRight } from '@elastic/eui/es/components/icon/assets/arrow_right';
import { icon as EuiIconSearch } from '@elastic/eui/es/components/icon/assets/search';
import { icon as EuiIconReturnKey } from '@elastic/eui/es/components/icon/assets/return_key';
import { icon as EuiIconCross } from '@elastic/eui/es/components/icon/assets/cross';
import { icon as EuiIconEmpty } from '@elastic/eui/es/components/icon/assets/empty';
import { icon as EuiIconAppAdvancedSettings } from '@elastic/eui/es/components/icon/assets/app_advanced_settings';
import { icon as EuiIconAppDevtools } from '@elastic/eui/es/components/icon/assets/app_devtools';
import { icon as EuiIconAppWatches } from '@elastic/eui/es/components/icon/assets/app_watches';
import { icon as EuiIconMlDataVisualizer } from '@elastic/eui/es/components/icon/assets/ml_data_visualizer';
import { icon as EuiIconDot } from '@elastic/eui/es/components/icon/assets/dot';
import { icon as EuiIconDocumentEdit } from '@elastic/eui/es/components/icon/assets/documentEdit';
import { icon as EuiIconTrash } from '@elastic/eui/es/components/icon/assets/trash';
import { icon as EuiIconPlay } from '@elastic/eui/es/components/icon/assets/play';
import { icon as EuiIconPause } from '@elastic/eui/es/components/icon/assets/pause';

appendIconComponentCache({
  dot: EuiIconDot,
  arrowUp: EuiIconArrowUp,
  arrowDown: EuiIconArrowDown,
  arrowLeft: EuiIconArrowLeft,
  arrowRight: EuiIconArrowRight,
  search: EuiIconSearch,
  returnKey: EuiIconReturnKey,
  cross: EuiIconCross,
  empty: EuiIconEmpty,
  advancedSettingsApp: EuiIconAppAdvancedSettings,
  devToolsApp: EuiIconAppDevtools,
  watchesApp: EuiIconAppWatches,
  dataVisualizer: EuiIconMlDataVisualizer,
  documentEdit: EuiIconDocumentEdit,
  trash: EuiIconTrash,
  play: EuiIconPlay,
  pause: EuiIconPause
});

const Home = React.lazy(() => import('./Home'));
const Logs = React.lazy(() => import('./Logs'));
const PodInfo = React.lazy(() => import('./PodInfo'));
const Deployments = React.lazy(() => import('./Deployments'));
const Services = React.lazy(() => import('./Services'));
const ServiceInfo = React.lazy(() => import('./ServiceInfo'));
const DeploymentInfo = React.lazy(() => import('./DeploymentInfo'));
const Jobs = React.lazy(() => import('./Jobs'));
const CronJobs = React.lazy(() => import('./CronJobs'));
const JobInfo = React.lazy(() => import('./JobInfo'));
const CronJobInfo = React.lazy(() => import('./CronJobInfo'));
const Pods = React.lazy(() => import('./Pods'));
const StatefulSets = React.lazy(() => import('./StatefulSets'));
const Hpa = React.lazy(() => import('./Hpa'));
const HpaInfo = React.lazy(() => import('./HpaInfo'));
const Pvc = React.lazy(() => import('./Pvc'));
const PvcInfo = React.lazy(() => import('./PvcInfo'));
const Nodes = React.lazy(() => import('./Nodes'));
const NodeInfo = React.lazy(() => import('./NodeInfo'));
const Editor = React.lazy(() => import('./Editor'));
const PortForward = React.lazy(() => import('./PortForward'));
const Ingress = React.lazy(() => import('./Ingress'));
const ConfigMap = React.lazy(() => import('./ConfigMap'));
const Secret = React.lazy(() => import('./Secret'));
const SecretInfo = React.lazy(() => import('./SecretInfo'));
const DefaultPage = React.lazy(() => import('./DefaultPage'));

const themes = {
  light: {
    background: backgroundLight,
    header: primaryDark,
    headerIcon: fontColorWhite,
    sidebarBackground: primaryLight,
    sidebarFontColor: fontColor,
    containerFont: fontColorDark,
    cardBackground: cardBackgroundLight,
    tableBorder: tableBorderLight,
    controllerBackground: backgroundLight,
    controllerColor: fontColor,
    controllerBorder: controllerBorderLight,
    loadingContainer: primary,
    loadingIndicator: primaryLight
  },

  dark: {
    background: darkDark,
    header: darkLight,
    headerIcon: fontColorWhite,
    sidebarBackground: darkDark,
    sidebarFontColor: fontColorWhite,
    containerFont: fontColorWhite,
    cardBackground: cardBackgroundDark,
    tableBorder: tableBorderDark,
    controllerBackground: darkLight,
    controllerColor: fontColorWhite,
    controllerBorder: controllerBorderDark,
    loadingContainer: primaryDark,
    loadingIndicator: primaryLight
  }
};

function App() {
  const { config, changeConfig } = useConfigContext();
  const [links, setLinks] = useState([]);
  const [namespaceSelectOpen, setNamespaceSelectOpen] = useState(false);
  const { data: response, revalidate } = useSWR(
    ['default', 'get namespaces'],
    kubectl.exec,
    { revalidateOnFocus: false }
  );

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
    changeConfig({ theme: config.theme === 'light' ? 'dark' : 'light' });
  };

  const handleNamespaceSelection = () => setNamespaceSelectOpen(true);

  const handleNamespaceDismiss = () => setNamespaceSelectOpen(false);

  const handleContextChange = () => revalidate();

  return (
    <ThemeProvider theme={themes[config.theme]}>
      <Global
        styles={css`
          a {
            color: inherit;
          }

          #app {
            display: -webkit-flex;
            display: flex;
            -webkit-flex-direction: column;
            flex-direction: column;
            min-height: calc(100vh - 49px);
          }

          .euiBody--headerIsFixed {
            padding-top: 49px;
          }

          .euiBody--headerIsFixed .euiPageSideBar--sticky {
            max-height: calc(100vh - 49px);
            top: 49px;
          }

          .euiIcon--app .euiIcon__fillSecondary {
            fill: #64b5f6;
          }
        `}
      />
      <Location>
        {({ location, navigate }) => (
          <Fragment>
            <Header location={location} onContextChange={handleContextChange} />
            <EuiPageTemplate
              restrictWidth={false}
              pageSideBar={
                <Sidebar
                  namespaces={namespaces}
                  links={links}
                  onThemeChange={handleThemeChange}
                  onNamespaceChange={handleNamespaceSelection}
                />
              }
            >
              <Hotkeys keyName="g+n,g+n" onKeyUp={handleNamespaceSelection}>
                <SearchDialog
                  isOpen={namespaceSelectOpen}
                  onDismiss={handleNamespaceDismiss}
                  dialogItems={
                    namespaces &&
                    namespaces.map(namespace => ({
                      value: namespace,
                      callback: ({ value: selectedNamespace }) => {
                        let [
                          url,
                          ui,
                          namespace,
                          type
                        ] = location.pathname.split('/');
                        navigate(`/ui/${selectedNamespace}/${type}`);
                        handleNamespaceDismiss();
                      }
                    }))
                  }
                  selected="Namespaces"
                  loading={false}
                  onSelect={handleNamespaceDismiss}
                />
              </Hotkeys>
              <Suspense fallback={<RouterLoading />}>
                <ErrorBoundary key={location.href} fallback={<ErrorLoading />}>
                  <CustomRouter basepath="/ui">
                    <Redirect from="/" to="/ui/default/pods" noThrow />
                    {/* <Home path="/:namespace" /> */}
                    <Pods path=":namespace/pods" />
                    {/* <PodInfo path=":namespace/pods/:name/get" /> */}
                    <Services path=":namespace/services" />
                    {/* <ServiceInfo path=":namespace/services/:name/get" /> */}
                    <Deployments path=":namespace/deployments" />
                    {/* <DeploymentInfo
                      path=":namespace/deployments/:name/get"
                      type="deployments"
                    /> */}
                    <Jobs path=":namespace/jobs" />
                    {/* <JobInfo path=":namespace/jobs/:name/get" /> */}
                    <CronJobs path=":namespace/cronjobs" />
                    {/* <CronJobInfo path=":namespace/cronjobs/:name/get" /> */}
                    {/* <StatefulSets path=":namespace/statefulsets" /> */}
                    {/* <DeploymentInfo
                      path=":namespace/statefulsets/:name/get"
                      type="statefulsets"
                    /> */}
                    <Hpa path=":namespace/hpa" />
                    <HpaInfo path=":namespace/hpa/:name/get" />
                    <Pvc path=":namespace/pvc" />
                    {/* <PvcInfo path=":namespace/pvc/:name/get" /> */}
                    {/* <Nodes path=":namespace/nodes" />
                    <NodeInfo path=":namespace/nodes/:name/get" /> */}
                    <Ingress path=":namespace/ingress" />
                    <Logs
                      path=":namespace/pods/:name/logs"
                      onLogInit={handleSidebarChange}
                    />
                    <Editor path=":namespace/new" type="new" action="get" />
                    <Editor path=":namespace/:type/:name/edit" action="get" />
                    <Editor
                      path=":namespace/:type/:name/describe"
                      action="describe"
                    />
                    <PortForward path=":namespace/port-forward" />
                    <ConfigMap path=":namespace/configmaps" />
                    <Secret path=":namespace/secrets" />
                    {/* <SecretInfo path=":namespace/secrets/:name/get" /> */}
                    {/* <ScaledObjects path=":namespace/scaledobjects" /> */}
                    {/* <SecretInfo path=":namespace/secrets/:name/get" /> */}
                    <DefaultPage path=":namespace/:type" />
                  </CustomRouter>
                </ErrorBoundary>
              </Suspense>
            </EuiPageTemplate>
          </Fragment>
        )}
      </Location>
    </ThemeProvider>
  );

  return (
    <ThemeProvider theme={themes[config.theme]}>
      <Global
        styles={css`
          * {
            padding: 0 0;
            margin: 0 0;
            box-sizing: border-box;
            font-family: 'Roboto', sans-serif;
          }

          a {
            color: inherit;
          }
        `}
      />
      <Location>
        {({ location, navigate }) => (
          <Fragment>
            <Header location={location} />
            <AppContainer>
              <Sidebar
                namespaces={namespaces}
                links={links}
                onThemeChange={handleThemeChange}
                onNamespaceChange={handleNamespaceSelection}
              />
              <Hotkeys keyName="g+n,g+n" onKeyUp={handleNamespaceSelection}>
                <SearchDialog
                  isOpen={namespaceSelectOpen}
                  onDismiss={handleNamespaceDismiss}
                  dialogItems={
                    namespaces &&
                    namespaces.map(namespace => ({
                      value: namespace,
                      callback: ({ value: selectedNamespace }) => {
                        let [
                          url,
                          ui,
                          namespace,
                          type
                        ] = location.pathname.split('/');
                        navigate(`/ui/${selectedNamespace}/${type}`);
                        handleNamespaceDismiss();
                      }
                    }))
                  }
                  selected="Namespaces"
                  loading={false}
                  onSelect={handleNamespaceDismiss}
                />
              </Hotkeys>
              <Suspense fallback={<RouterLoading />}>
                <ErrorBoundary key={location.href} fallback={<ErrorLoading />}>
                  <CustomRouter basepath="/ui">
                    <Redirect from="/" to="/ui/default/pods" noThrow />
                    {/* <Home path="/:namespace" /> */}
                    <Pods path=":namespace/pods" />
                    <PodInfo path=":namespace/pods/:name/get" />
                    <Services path=":namespace/services" />
                    <ServiceInfo path=":namespace/services/:name/get" />
                    <Deployments path=":namespace/deployments" />
                    <DeploymentInfo
                      path=":namespace/deployments/:name/get"
                      type="deployments"
                    />
                    <Jobs path=":namespace/jobs" />
                    <JobInfo path=":namespace/jobs/:name/get" />
                    <CronJobs path=":namespace/cronjobs" />
                    <CronJobInfo path=":namespace/cronjobs/:name/get" />
                    <StatefulSets path=":namespace/statefulsets" />
                    <DeploymentInfo
                      path=":namespace/statefulsets/:name/get"
                      type="statefulsets"
                    />
                    <Hpa path=":namespace/hpa" />
                    <HpaInfo path=":namespace/hpa/:name/get" />
                    <Pvc path=":namespace/pvc" />
                    <PvcInfo path=":namespace/pvc/:name/get" />
                    <Nodes path=":namespace/nodes" />
                    <NodeInfo path=":namespace/nodes/:name/get" />
                    <Ingress path=":namespace/ingress" />
                    <Logs
                      path=":namespace/pods/:name/logs"
                      onLogInit={handleSidebarChange}
                    />
                    <Editor path=":namespace/new" type="new" action="get" />
                    <Editor path=":namespace/:type/:name/edit" action="get" />
                    <Editor
                      path=":namespace/:type/:name/describe"
                      action="describe"
                    />
                    <PortForward path=":namespace/port-forward" />
                    <ConfigMap path=":namespace/configmaps" />
                    <Secret path=":namespace/secrets" />
                    <SecretInfo path=":namespace/secrets/:name/get" />
                    <ScaledObjects path=":namespace/scaledobjects" />
                    {/* <SecretInfo path=":namespace/secrets/:name/get" /> */}
                  </CustomRouter>
                </ErrorBoundary>
              </Suspense>
            </AppContainer>
          </Fragment>
        )}
      </Location>
    </ThemeProvider>
  );
}

export default App;
