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
      text-underline-position: under;
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
  margin-top: 0.8rem;
  margin-bottom: 1rem;
  cursor: pointer;
  text-decoration: none;
  ${({ headerDescription }) =>
    headerDescription &&
    `font-size: 2rem;
     margin-bottom: 0rem;

  `}
`;

const HeaderMain = styled.div`
  background-color: ${({ theme }) => theme.colors.headerMain};
  padding: 0.56rem 0;
  padding-left: 1rem;
  padding-right: 1rem;
`;

const Header = ({
  variant,
  children,
  headerDescription,
  logo,
  headerTopContent,
}) => {
  return (
    <>
      <HeaderTop variant={variant}>
        {logo}
        {headerTopContent}
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
  headerTopContent: PropType.node,
};

Header.defaultProps = {
  variant: "Internal",
};

export default Header;
