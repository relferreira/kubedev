import React from 'react';
import styled from '@emotion/styled';
import { primaryLight, fontColor, primaryDark, primary } from '../util/colors';
import { Link } from '@reach/router';

const Sidebar = styled.div`
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

export default props => (
  <Sidebar>
    <NavLink to="/">Home</NavLink>
    <NavLink to="/namespaces">Namespaces</NavLink>
    <NavLink to="/services">Services</NavLink>
    <NavLink to="/deployments">Deployments</NavLink>
    <NavLink to="/pods">Pods</NavLink>
    <NavLink to="/nodes">Nodes</NavLink>
  </Sidebar>
);
