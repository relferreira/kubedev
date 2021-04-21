import React, { useRef } from 'react';
import styled from '@emotion/styled';
import { primaryLight, fontColor, primaryDark } from '../util/colors';
import { Link, Location, navigate } from '@reach/router';
import { getSelectedNamespace } from '../state-management/general-managements';
import LocationHistoryController from './LocationHistoryController';
import Hotkeys from 'react-hot-keys';
import CustomTooltip from './CustomTooltip';

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  // flex: 0 0 200px;
  // width: 200px;
  // background: ${props => props.theme.sidebarBackground};
  // color: ${props => props.theme.sidebarFontColor};
  // overflow: auto;
`;

const HistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SidebarTitle = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px;

  hr {
    flex: 1;
    margin-left: 10px;
    border: none;
    border-bottom: 1px solid ${fontColor};
  }
`;

function CustomLink({ className, shortcut, ...rest }) {
  const linkRef = useRef(null);
  return (
    <Hotkeys keyName={`${shortcut}`} onKeyUp={() => linkRef.current.click()}>
      {/* <CustomTooltip label="Refresh"> */}
      <Link
        {...rest}
        ref={linkRef}
        getProps={({ isCurrent }) => {
          return {
            className: className + (isCurrent ? ' active' : '')
          };
        }}
      />
      {/* </CustomTooltip> */}
    </Hotkeys>
  );
}

const NavLink = styled(CustomLink)`
  padding: 10px 16px;
  color: ${props => props.theme.sidebarFontColor};
  text-decoration: none;
  font-size: 16px;
  cursor: pointer;

  &.active {
    font-weight: bold;
    color: ${primaryDark};
  }
`;

const ThemeLink = styled.a`
  padding: 10px 16px;
  text-decoration: none;
  font-size: 16px;
  cursor: pointer;
`;

const HistoryLink = styled(NavLink)`
  width: 200px;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NamespaceSelected = styled.button`
  display: flex;
  align-items: center;
  min-width: inherit;
  width: 106px;
  margin: 0px 5px 0px 0px;
  font-size: 14px;
  text-align: left;
  background: transparent;
  border: none;
  color: ${props => props.theme.containerFont};
  cursor: pointer;
  outline: none;

  span {
    flex: 1;
  }

  svg {
    fill: ${props => props.theme.containerFont};
    transform: rotate(90deg);
  }
`;

const NamespaceSelectContainer = styled.div`
  display: flex;
  padding: 0px 16px;
`;

const Sidebar = ({ namespaces, links, onNamespaceChange, onThemeChange }) => (
  <Location>
    {({ location }) => {
      let namespace = getSelectedNamespace(location);
      return (
        <SidebarContainer>
          <SidebarTitle>
            <p>Namespaces</p>
            <hr />
          </SidebarTitle>
          <NamespaceSelectContainer>
            <NamespaceSelected onClick={onNamespaceChange}>
              <span>{namespace}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                <path fill="none" d="M0 0h24v24H0V0z" />
              </svg>
            </NamespaceSelected>
            <LocationHistoryController />
          </NamespaceSelectContainer>
          <SidebarTitle>
            <p>Resources</p>
            <hr />
          </SidebarTitle>
          <NavLink to={`/ui/${namespace}/nodes`} shortcut="g+n">
            Nodes
          </NavLink>
          <NavLink to={`/ui/${namespace}/services`} shortcut="g+s">
            Services
          </NavLink>
          <NavLink to={`/ui/${namespace}/deployments`} shortcut="g+d">
            Deployments
          </NavLink>
          <NavLink to={`/ui/${namespace}/jobs`} shortcut="g+j">
            Jobs
          </NavLink>
          <NavLink to={`/ui/${namespace}/cronjobs`} shortcut="g+c">
            CronJobs
          </NavLink>
          <NavLink to={`/ui/${namespace}/statefulsets`} shortcut="g+t">
            StatefulSets
          </NavLink>
          <NavLink to={`/ui/${namespace}/hpa`} shortcut="g+h">
            Hpa
          </NavLink>
          <NavLink to={`/ui/${namespace}/pvc`} shortcut="g+v">
            Pvc
          </NavLink>
          <NavLink to={`/ui/${namespace}/pods`} shortcut="g+p">
            Pods
          </NavLink>
          <NavLink to={`/ui/${namespace}/ingress`} shortcut="g+i">
            Ingress
          </NavLink>
          <NavLink to={`/ui/${namespace}/configmaps`} shortcut="g+m">
            Config Maps
          </NavLink>
          <NavLink to={`/ui/${namespace}/secrets`} shortcut="g+r">
            Secrets
          </NavLink>
          <NavLink to={`/ui/${namespace}/port-forward`} shortcut="g+f">
            Port Forward
          </NavLink>
          <ThemeLink onClick={onThemeChange}>Change Theme</ThemeLink>
          <HistoryContainer>
            <SidebarTitle>
              <p>History</p>
              <hr />
            </SidebarTitle>
            {links.map(({ type, namespace, name }) => (
              <HistoryLink
                key={`${type}${namespace}${name}`}
                to={`${namespace}/pods/${name}/logs`}
                replace
              >
                {name}
              </HistoryLink>
            ))}
          </HistoryContainer>
        </SidebarContainer>
      );
    }}
  </Location>
);

export default Sidebar;
