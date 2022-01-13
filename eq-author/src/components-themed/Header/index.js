import React from "react";
import styled from "styled-components";
import PropType from "prop-types";
import { Grid, Column } from "components/Grid";

const HeaderTop = styled.div`
  background-color: ${({ theme, variant }) =>
    variant === "Internal"
      ? theme.colors.internalHeaderTop
      : theme.colors.externalHeaderTop};
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
  padding-right: 1rem;
`;

const Header = ({
  variant,
  children,
  headerDescription,
  logo,
  headerTopContent,
  centerCols,
}) => {
  return (
    <>
      <HeaderTop variant={variant}>
        <Grid align="center" horizontalAlign="center">
          <Column cols={centerCols}>
            {logo}
            {headerTopContent}
          </Column>
        </Grid>
      </HeaderTop>
      <HeaderMain headerDescription={headerDescription}>
        <Grid horizontalAlign="center">
          <Column cols={centerCols}>
            <HeaderTitle headerDescription={headerDescription}>
              {children}
            </HeaderTitle>
            {headerDescription && (
              <HeaderDescription>{headerDescription}</HeaderDescription>
            )}
          </Column>
        </Grid>
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
  centerCols: PropType.number,
};

Header.defaultProps = {
  variant: "Internal",
  centerCols: 12,
};

export default Header;
