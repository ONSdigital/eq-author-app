import React from "react";
import styled from "styled-components";
import PropType from "prop-types";

const HeaderTop = styled.div`
  background-color: ${({ theme, variant }) =>
    variant === "Internal"
      ? theme.colors.internalHeaderTop
      : theme.colors.externalHeaderTop};
  padding: 0 1rem;
  height: 46px;
  align-items: center;
  display: flex;
  justify-content: space-between;
  svg {
    path:nth-of-type(1) {
      fill: ${({ theme }) => theme.colors.onsLogoAccent};
    }
    fill: ${({ theme, variant }) =>
      variant === "Internal"
        ? theme.colors.internalOnsLogo
        : theme.colors.externalOnsLogo};
  }
  ul {
    li {
      display: inline-block;
      margin: 0 0 0 1rem;
      font-size: 1rem;
      &:hover {
        text-decoration: underline solid 3px;
      }
      a {
        color: ${({ theme }) => theme.colors.headerTitle};
      }
    }
  }
`;

const HeaderDescription = styled.p`
  color: ${({ theme }) => theme.colors.headerTitle};
  font-size: ${({ theme }) => theme.fontSize};
  line-height: 1.4;
  margin: 0 0 1rem;
`;

const HeaderTitle = styled.div`
  font-size: 1.6666666667rem;
  color: ${({ theme }) => theme.colors.headerTitle};
  font-weight: 700;
  line-height: 1.4;
  cursor: pointer;
  text-decoration: none;
  margin: 0;
  ${({ headerDescription }) =>
    headerDescription &&
    `font-size: 2rem;
  `}
`;

const HeaderMain = styled.div`
  background-color: ${({ theme }) => theme.colors.headerMain};
  padding: 0.56rem 0;
  padding-left: 1rem;
  padding-right: 1rem;
  height: auto;
`;

const Header = ({
  variant,
  children,
  headerDescription,
  logo,
  exampleList,
}) => {
  return (
    <>
      <HeaderTop variant={variant} exampleList={exampleList}>
        {logo}
        {exampleList}
      </HeaderTop>
      <HeaderMain headerDescription={headerDescription}>
        <HeaderTitle headerDescription={headerDescription}>
          {children}
        </HeaderTitle>
        {headerDescription && (
          <HeaderDescription>{headerDescription}</HeaderDescription>
        )}
      </HeaderMain>
    </>
  );
};

Header.propTypes = {
  variant: PropType.string,
  children: PropType.node,
  headerDescription: PropType.string,
  logo: PropType.node,
};

Header.defaultProps = {
  variant: "Internal",
};

export default Header;
