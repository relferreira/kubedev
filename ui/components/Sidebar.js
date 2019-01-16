import React from 'react';
import styled from '@emotion/styled';
import { primaryLight, fontColor, primaryDark, primary } from '../util/colors';
import { Link, Location, navigate } from '@reach/router';
import Select from './Select';

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 200px;
  background: ${primaryLight};
  color: ${fontColor};
`;

const CustomLink = styled(Link)`
  padding: 10px 16px;
  color: ${fontColor};
  text-decoration: none;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
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

const NavLink = props => (
  <CustomLink
    {...props}
    getProps={({ isCurrent }) => {
      return {
        style: {
          // background: isCurrent ? primary : 'none',
          color: isCurrent ? primaryDark : fontColor
        }
      };
    }}
  />
);

const HistoryLink = styled(NavLink)`
  width: 200px;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NamespaceSelect = styled(Select)`
  margin: 0px 10px;
  background: #fff;
`;

const getSelectedNamespace = location => {
  let matches = location.pathname.split('/');
  if (matches && matches.length > 1) return matches[1];
  return '';
};

const Sidebar = ({ namespaces, links }) => (
  <Location>
    {({ location }) => {
      let namespace = getSelectedNamespace(location);
      return (
        <SidebarContainer>
          <SidebarTitle>
            <p>Namespaces</p>
            <hr />
          </SidebarTitle>
          <NamespaceSelect
            value={namespace}
            onChange={event => navigate(`/${event.target.value}`)}
          >
            {namespaces.map(namespace => (
              <option key={namespace}>{namespace}</option>
            ))}
          </NamespaceSelect>
          <SidebarTitle>
            <p>Resources</p>
            <hr />
          </SidebarTitle>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/namespaces">Namespaces</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/deployments">Deployments</NavLink>
          <NavLink to={`/${namespace}/pods`}>Pods</NavLink>
          <NavLink to="/nodes">Nodes</NavLink>
          <HistoryContainer>
            <SidebarTitle>
              <p>History</p>
              <hr />
            </SidebarTitle>
            {links.map(({ type, namespace, name }) => (
              <HistoryLink
                key={`${type}${namespace}${name}`}
                to={`${namespace}/pods/${name}/logs/container/0`}
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
