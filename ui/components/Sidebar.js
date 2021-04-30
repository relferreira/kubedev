import React, { useRef } from 'react';
import useSWR from 'swr';
import { Link, Location, navigate } from '@reach/router';
import Hotkeys from 'react-hot-keys';
import { EuiCollapsibleNavGroup, EuiListGroup } from '@elastic/eui';

import * as kubectl from '../kubectl';
import LocationHistoryController from './LocationHistoryController';
import { getSelectedNamespace } from '../state-management/general-managements';

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

function Sidebar({
  namespaces,
  links,
  crds,
  onNamespaceChange,
  onThemeChange
}) {
  return (
    <Location>
      {({ location }) => {
        let namespace = getSelectedNamespace(location);
        return (
          <div>
            <EuiCollapsibleNavGroup
              title={
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <a
                    className="euiListGroupItem-isClickable"
                    onClick={onNamespaceChange}
                    style={{ flex: 1 }}
                  >
                    <small style={{ fontWeight: 'normal' }}>Namespace</small>{' '}
                    <br />
                    <strong>{namespace}</strong>
                  </a>
                  <LocationHistoryController />
                </div>
              }
              iconType="dataVisualizer"
              iconSize="l"
              isCollapsible={false}
              initialIsOpen={false}
              background="dark"
            ></EuiCollapsibleNavGroup>
            <EuiCollapsibleNavGroup
              title="Workloads"
              iconType="devToolsApp"
              iconSize="l"
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
            <EuiCollapsibleNavGroup
              title="Security"
              iconType="usersRolesApp"
              isCollapsible={true}
              initialIsOpen={false}
            >
              <EuiListGroup color="subdued" size="s">
                <CustomLink to={`/ui/${namespace}/serviceaccount`}>
                  Service Account
                </CustomLink>
                <CustomLink to={`/ui/${namespace}/clusterrole`}>
                  Cluster Role
                </CustomLink>
                <CustomLink to={`/ui/${namespace}/clusterrolebinding`}>
                  Cluster Role Binding
                </CustomLink>
              </EuiListGroup>
            </EuiCollapsibleNavGroup>
            <EuiCollapsibleNavGroup
              title="CRDs"
              iconType="discoverApp"
              isCollapsible={true}
              initialIsOpen={false}
            >
              <EuiListGroup color="subdued" size="s">
                {crds &&
                  Object.keys(crds).map(key => (
                    <EuiCollapsibleNavGroup
                      key={key}
                      title={key}
                      paddingSize="none"
                      titleSize="xs"
                      isCollapsible={true}
                      initialIsOpen={false}
                      style={{ border: 'none', padding: 0, margin: 0 }}
                      titleSize="xxs"
                    >
                      <EuiListGroup color="subdued" size="xs">
                        {crds[key].map((item, i) => (
                          <CustomLink
                            key={item.metadata.name + i}
                            to={`/ui/${namespace}/${item.spec.names.plural}`}
                          >
                            {item.spec.names.kind + item.metadata.name}
                          </CustomLink>
                        ))}
                      </EuiListGroup>
                    </EuiCollapsibleNavGroup>
                  ))}
              </EuiListGroup>
            </EuiCollapsibleNavGroup>
          </div>
        );
      }}
    </Location>
  );
}

export default Sidebar;
