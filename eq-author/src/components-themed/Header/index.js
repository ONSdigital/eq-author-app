import React from "react";
import styled, { css } from "styled-components";
import PropType from "prop-types";
import logoHeader from "assets/ons-logo-header.svg";

const Logo = styled.img`
  svg {
    path {
      fill: "#fff";
    }
  }
`;

const InternalHeaderTop = styled.div`
  background-color: ${({ theme }) => theme.colors.headerTop};
  padding: 0 1rem;
  height: 46px;
  align-items: center;
  display: flex;
`;

const WithDescription = css`
  color: ${({ theme }) => theme.colors.headerTitle};
  font-size: ${({ theme }) => theme.fontSize};
  /* font-weight: 400; */
  line-height: 1.4;
  /* margin: 0 0 1rem; */
`;

const HeaderTitle = styled.div`
  font-family: ${({ theme }) => theme.colors.fonts};
  font-size: 1.444rem;
  color: ${({ theme }) => theme.colors.headerTitle};
  font-weight: 600;
  line-height: 1.4;
  cursor: pointer;
  display: block;
  ${({ variant }) =>
    variant === "WithDescription" &&
    `
    font-size: 1.111rem;
  `}
`;

const HeaderMain = styled.div`
  background-color: ${({ theme }) => theme.colors.headerMain};
  padding: 0.56rem 0;
  padding-left: 18px;
  height: auto;

  ${({ variant }) => variant === "WithDescription" && WithDescription}
`;

const StyledHeader = styled.div`
  display: block;
  position: relative;
  margin: 0;
`;

const Header = ({ variant, children, HeaderDescription }) => {
  return (
    <StyledHeader>
      <InternalHeaderTop>
        <img src={logoHeader} alt="Office for National Statistics logo" />
      </InternalHeaderTop>
      <HeaderMain variant={variant}>
        <HeaderTitle variant={variant}>{children}</HeaderTitle>
        {variant === "WithDescription" && <div>{HeaderDescription}</div>}
      </HeaderMain>
    </StyledHeader>
  );
};

Header.propTypes = {
  variant: PropType.string,
  children: PropType.node,
};

Header.defaultProps = {
  type: "Header",
  variant: "Internal",
};

export default Header;
