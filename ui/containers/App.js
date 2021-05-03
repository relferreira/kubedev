import React, { useState, Suspense, Fragment } from 'react';
import { Redirect, Location, Router } from '@reach/router';
import useSWR from 'swr';
import Hotkeys from 'react-hot-keys';
import '@elastic/eui/dist/eui_theme_dark.css';
import '../styles.css';

import * as kubectl from '../kubectl';
import Sidebar from '../components/Sidebar';
import Header from './Header';
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
import { icon as EuiIconDiscoverApp } from '@elastic/eui/es/components/icon/assets/app_discover';
import { icon as EuiIconRefresh } from '@elastic/eui/es/components/icon/assets/refresh';
import { icon as EuiIconFilebeat } from '@elastic/eui/es/components/icon/assets/app_filebeat';
import { icon as EuiIconManagement } from '@elastic/eui/es/components/icon/assets/app_management';
import { icon as EuiIconMonitoring } from '@elastic/eui/es/components/icon/assets/app_monitoring';
import { icon as EuiIconBoxesVertical } from '@elastic/eui/es/components/icon/assets/boxes_vertical';
import { icon as EuiIconAppUsersRoles } from '@elastic/eui/es/components/icon/assets/app_users_roles';
import { icon as EuiIconSortDown } from '@elastic/eui/es/components/icon/assets/sort_down';
import { icon as EuiIconSortUp } from '@elastic/eui/es/components/icon/assets/sort_up';
import { icon as EuiIconSave } from '@elastic/eui/es/components/icon/assets/save';
import { icon as EuiIconCheck } from '@elastic/eui/es/components/icon/assets/check';
import { icon as EuiIconAlert } from '@elastic/eui/es/components/icon/assets/alert';
import { icon as EuiIconPlus } from '@elastic/eui/es/components/icon/assets/plus';

appendIconComponentCache({
  dot: EuiIconDot,
  sortDown: EuiIconSortDown,
  sortUp: EuiIconSortUp,
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
  pause: EuiIconPause,
  discoverApp: EuiIconDiscoverApp,
  refresh: EuiIconRefresh,
  managementApp: EuiIconManagement,
  filebeatApp: EuiIconFilebeat,
  monitoringApp: EuiIconMonitoring,
  boxesVertical: EuiIconBoxesVertical,
  usersRolesApp: EuiIconAppUsersRoles,
  save: EuiIconSave,
  check: EuiIconCheck,
  alert: EuiIconAlert,
  plus: EuiIconPlus
});

const Home = React.lazy(() => import('./Home'));
const Logs = React.lazy(() => import('./Logs'));
const ServiceInfo = React.lazy(() => import('./ServiceInfo'));
const DeploymentInfo = React.lazy(() => import('./DeploymentInfo'));
const Editor = React.lazy(() => import('./Editor'));
const PortForward = React.lazy(() => import('./PortForward'));
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

  const { data: responseCRDs, revalidate: revalidateCRDs } = useSWR(
    ['default', 'get crd'],
    kubectl.exec,
    { revalidateOnFocus: false }
  );

  const { data } = response || {};
  let namespaces = [];
  if (data) {
    namespaces = data.items.map(({ metadata }) => metadata.name);
  }

  let crds = [];
  if (responseCRDs && responseCRDs.data) {
    crds = responseCRDs.data.items.reduce((acc, value) => {
      if (!acc[value.spec.group]) acc[value.spec.group] = [];

      acc[value.spec.group].push(value);
      return acc;
    }, {});
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

  const handleContextChange = () => {
    revalidate();
    revalidateCRDs();
  };

  return (
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
                crds={crds}
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
                      let [url, ui, namespace, type] = location.pathname.split(
                        '/'
                      );
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
                <Router basepath="/ui">
                  <Redirect from="/" to="/ui/default/pods" noThrow />
                  {/* <Home path="/:namespace" /> */}
                  <ServiceInfo path=":namespace/services/:name/get" />
                  <DeploymentInfo path=":namespace/deployments/:name/get" />
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
                  <DefaultPage path=":namespace/:type" />
                </Router>
              </ErrorBoundary>
            </Suspense>
          </EuiPageTemplate>
        </Fragment>
      )}
    </Location>
  );
}

export default App;
