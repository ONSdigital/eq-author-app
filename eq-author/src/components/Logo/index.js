import React from "react";
import styled from "styled-components";

import { colors } from "constants/theme";

import logo from "./logo.svg";

export const Logo = styled.a`
  width: 6.5em;
  display: flex;
  align-items: center;
  margin: 1em 0.5em;
  padding: 0.5em;
  &:focus {
    outline: 3px solid ${colors.tertiary};
  }
`;

const LogoImg = styled.img`
  display: inline-block;
  width: 100%;
  height: auto;
`;

export default () => (
  <Logo href="/" data-test="logo">
    <LogoImg src={logo} alt="Author" width={20} />
  </Logo>
);
