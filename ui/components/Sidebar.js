import React, { useRef } from 'react';
import { Link, Location, navigate } from '@reach/router';
import { getSelectedNamespace } from '../state-management/general-managements';
import Hotkeys from 'react-hot-keys';
import { EuiCollapsibleNavGroup, EuiListGroup } from '@elastic/eui';

function CustomLink({ className, shortcut, children, ...rest }) {
  const linkRef = useRef(null);
  return (
    <Hotkeys keyName={`${shortcut}`} onKeyUp={() => linkRef.current.click()}>
      <Link
        {...rest}
        ref={linkRef}
        getProps={({ isCurrent }) => {
          return {
            className: `euiListGroupItem euiListGroupItem--small euiListGroupItem-isClickable ${
              isCurrent ? ' euiListGroupItem-isActive' : ''
            }`
          };
        }}
      >
        <span className="euiListGroupItem__button">
          <span className="euiListGroupItem__label" title="Item">
            {children}
          </span>
        </span>
      </Link>
    </Hotkeys>
  );
}

const Sidebar = ({ namespaces, links, onNamespaceChange, onThemeChange }) => (
  <Location>
    {({ location }) => {
      let namespace = getSelectedNamespace(location);
      return (
        <div>
          <EuiCollapsibleNavGroup
            title={
              <a
                className="euiListGroupItem-isClickable"
                onClick={onNamespaceChange}
              >
                <small style={{ fontWeight: 'normal' }}>Namespace</small> <br />
                <strong>{namespace}</strong>
              </a>
            }
            iconType="dataVisualizer"
            iconSize="xl"
            isCollapsible={false}
            initialIsOpen={false}
            background="dark"
          ></EuiCollapsibleNavGroup>
          <EuiCollapsibleNavGroup
            title="Workloads"
            iconType="devToolsApp"
            isCollapsible={true}
            initialIsOpen={true}
          >
            <EuiListGroup color="subdued" size="s">
              <CustomLink to={`/ui/${namespace}/deployments`} shortcut="g+d">
                Deployments
              </CustomLink>
              <CustomLink to={`/ui/${namespace}/pods`} shortcut="g+p">
                Pods
              </CustomLink>
              <CustomLink to={`/ui/${namespace}/jobs`} shortcut="g+j">
                Jobs
              </CustomLink>
              <CustomLink to={`/ui/${namespace}/cronjobs`} shortcut="g+c">
                CronJobs
              </CustomLink>
              <CustomLink to={`/ui/${namespace}/statefulsets`} shortcut="g+t">
                StatefulSets
              </CustomLink>
              <CustomLink to={`/ui/${namespace}/nodes`} shortcut="g+n">
                Nodes
              </CustomLink>
            </EuiListGroup>
          </EuiCollapsibleNavGroup>
          <EuiCollapsibleNavGroup
            title="Network"
            iconType="watchesApp"
            isCollapsible={true}
            initialIsOpen={false}
          >
            <EuiListGroup color="subdued" size="s">
              <CustomLink to={`/ui/${namespace}/services`} shortcut="g+s">
                Services
              </CustomLink>
              <CustomLink to={`/ui/${namespace}/ingress`} shortcut="g+i">
                Ingress
              </CustomLink>
              <CustomLink to={`/ui/${namespace}/port-forward`} shortcut="g+f">
                Port Forward
              </CustomLink>
            </EuiListGroup>
          </EuiCollapsibleNavGroup>
          <EuiCollapsibleNavGroup
            title="Configurations"
            iconType="advancedSettingsApp"
            isCollapsible={true}
            initialIsOpen={false}
          >
            <EuiListGroup color="subdued" size="s">
              <CustomLink to={`/ui/${namespace}/hpa`} shortcut="g+h">
                Hpa
              </CustomLink>
              <CustomLink to={`/ui/${namespace}/pvc`} shortcut="g+v">
                Pvc
              </CustomLink>

              <CustomLink to={`/ui/${namespace}/configmaps`} shortcut="g+m">
                Config Maps
              </CustomLink>
              <CustomLink to={`/ui/${namespace}/secrets`} shortcut="g+r">
                Secrets
              </CustomLink>
            </EuiListGroup>
          </EuiCollapsibleNavGroup>
        </div>
      );
    }}
  </Location>
);

export default Sidebar;
