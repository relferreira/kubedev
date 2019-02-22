import React from 'react';
import styled from '@emotion/styled';
import { primaryDark } from '../util/colors';

import logo from '../assets/logo.svg';

const Header = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  height: 60px;
  padding: 16px;
  background: ${props => props.theme.header};
  color: white;
  box-shadow: 0 0 0.4rem rgba(0, 0, 0, 0.1), 0 0.1rem 0.8rem rgba(0, 0, 0, 0.2);
  overflow: auto;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  // width: 204px;
  height: 100%;
`;

const Image = styled.img`
  height: 100%;
`;

const Title = styled.h1`
  margin-left: 16px;
  font-size: 24px;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex: 1;

  input {
    width: 500px;
    height: 40px;
    padding: 16px;
    border: none;
    border-radius: 3px;
    background: ${props => props.theme.background};
    color: #fff;
  }
`;

export default props => (
  <Header>
    <LogoContainer>
      <Image src={logo} />
      <Title>KubeDev</Title>
    </LogoContainer>
    {/* <InputContainer>
      <input type="text" placeholder="Search" />
    </InputContainer> */}
  </Header>
);
