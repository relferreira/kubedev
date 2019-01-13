import React from 'react';
import styled from '@emotion/styled';
import { primaryLight, fontColor, primaryDark, primary } from '../util/colors';
import { Link } from '@reach/router';

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

const HistoryTitle = styled.div`
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

const FavoriteLink = favorite => (
  <NavLink key={`${favorite.type}${favorite.name}`} to="/nodes">
    {favorite.name}
  </NavLink>
);

const Sidebar = ({ links }) => (
  <SidebarContainer>
    <NavLink to="/">Home</NavLink>
    <NavLink to="/namespaces">Namespaces</NavLink>
    <NavLink to="/services">Services</NavLink>
    <NavLink to="/deployments">Deployments</NavLink>
    <NavLink to="/pods">Pods</NavLink>
    <NavLink to="/nodes">Nodes</NavLink>
    <HistoryContainer>
      <HistoryTitle>
        <p>History</p>
        <hr />
      </HistoryTitle>
      {links.map(link => (
        <HistoryLink
          key={`${link.type}${link.name}`}
          to={`/pods/${link.name}/logs/container/0`}
          replace
        >
          {link.name}
        </HistoryLink>
      ))}
    </HistoryContainer>
  </SidebarContainer>
);

export default Sidebar;
