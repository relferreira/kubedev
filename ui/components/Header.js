import React from 'react';
import styled from '@emotion/styled';
import { primaryDark } from '../util/colors';

import logo from '../assets/logo.svg';

const Header = styled.div`
  display: flex;
  align-items: center;
  height: 70px;
  padding: 16px;
  background: ${props => props.theme.header};
  color: white;
`;

const Image = styled.img`
  height: 100%;
`;

const Title = styled.h1`
  margin-left: 16px;
  font-size: 24px;
`;

export default props => (
  <Header>
    <Image src={logo} />
    <Title>KubeDev</Title>
  </Header>
);
