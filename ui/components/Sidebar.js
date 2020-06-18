import React from 'react';
import styled from '@emotion/styled';
import { primaryLight, fontColor, primaryDark, primary } from '../util/colors';
import { Link, Location, navigate } from '@reach/router';
import Select from './Select';
import { getSelectedNamespace } from '../state-management/general-managements';
import LocationHistoryController from './LocationHistoryController';

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 200px;
  width: 200px;
  background: ${props => props.theme.sidebarBackground};
  color: ${props => props.theme.sidebarFontColor};
  overflow: auto;
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

const CustomLink = ({ className, ...rest }) => (
  <Link
    {...rest}
    getProps={({ isCurrent }) => {
      return {
        className: className + (isCurrent ? ' active' : '')
      };
    }}
  />
);

const NavLink = styled(CustomLink)`
  padding: 10px 16px;
  color: ${props => props.theme.sidebarFontColor};
  text-decoration: none;
  font-size: 18px;
  cursor: pointer;

  &.active {
    font-weight: bold;
    color: ${primaryDark};
  }
`;

const ThemeLink = styled.a`
  padding: 10px 16px;
  text-decoration: none;
  font-size: 18px;
  cursor: pointer;
`;

const HistoryLink = styled(NavLink)`
  width: 200px;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NamespaceSelect = styled(Select)`
  min-width: inherit;
  width: 106px;
  margin: 0px 5px 0px 0px;
`;

const NamespaceSelectContainer = styled.div`
  display: flex;
  padding: 0px 16px;
`;

const Sidebar = ({ namespaces, links, onThemeChange }) => (
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
            <NamespaceSelect
              value={namespace}
              aria-label="namespace-selector"
              onChange={event => navigate(`/ui/${event.target.value}/pods`)}
            >
              {namespaces.map(namespace => (
                <option key={namespace}>{namespace}</option>
              ))}
            </NamespaceSelect>
            <LocationHistoryController />
          </NamespaceSelectContainer>
          <SidebarTitle>
            <p>Resources</p>
            <hr />
          </SidebarTitle>
          <NavLink to={`/ui/${namespace}/nodes`}>Nodes</NavLink>
          <NavLink to={`/ui/${namespace}/services`}>Services</NavLink>
          <NavLink to={`/ui/${namespace}/deployments`}>Deployments</NavLink>
          <NavLink to={`/ui/${namespace}/jobs`}>Jobs</NavLink>
          <NavLink to={`/ui/${namespace}/cronjobs`}>CronJobs</NavLink>
          <NavLink to={`/ui/${namespace}/statefulsets`}>StatefulSets</NavLink>
          <NavLink to={`/ui/${namespace}/hpa`}>Hpa</NavLink>
          <NavLink to={`/ui/${namespace}/pvc`}>Pvc</NavLink>
          <NavLink to={`/ui/${namespace}/pods`}>Pods</NavLink>
          <NavLink to={`/ui/${namespace}/ingress`}>Ingress</NavLink>
          <NavLink to={`/ui/${namespace}/configmaps`}>Config Maps</NavLink>
          <NavLink to={`/ui/${namespace}/secrets`}>Secrets</NavLink>
          <NavLink to={`/ui/${namespace}/port-forward`}>Port Forward</NavLink>
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
