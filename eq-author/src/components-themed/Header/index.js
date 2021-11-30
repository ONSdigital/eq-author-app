import React from "react";
import styled from "styled-components";
import PropType from "prop-types";

const getSvgColour = (variant) => {
  switch (variant) {
    case "Internal":
      return ({ theme }) => theme.colors.internalOnsLogo;
    case "External":
      return ({ theme }) => theme.colors.externalOnsLogo;
  }
};

const getHeaderTopColour = (variant) => {
  switch (variant) {
    case "Internal":
      return ({ theme }) => theme.colors.internalHeaderTop;
    case "External":
      return ({ theme }) => theme.colors.externalHeaderTop;
  }
};

const HeaderTop = styled.div`
  background-color: ${({ variant }) => getHeaderTopColour(variant)};
  padding: 0 1rem;
  height: 46px;
  align-items: center;
  display: flex;
  svg {
    path:nth-of-type(1) {
      fill: ${({ theme }) => theme.colors.onsLogoAccent};
    }
    fill: ${({ variant }) => getSvgColour(variant)};
  }
`;

const HeaderDescription = styled.p`
  color: ${({ theme }) => theme.colors.headerTitle};
  font-size: ${({ theme }) => theme.fontSize};
  line-height: 1.4;
  margin: 0 0 1rem;
`;

const HeaderTitle = styled.h1`
  font-size: 1.6666666667rem;
  color: ${({ theme }) => theme.colors.headerTitle};
  font-weight: 900;
  line-height: 1.4;
  cursor: pointer;
  text-decoration: none;
  letter-spacing: 0.1rem;
  margin: 0;
  ${({ withDescription }) =>
    withDescription &&
    `font-size: 2rem;
  `}
`;

const HeaderMain = styled.div`
  background-color: ${({ theme }) => theme.colors.headerMain};
  padding: 0.56rem 0;
  padding-left: 18px;
  height: auto;
`;

const Header = ({
  variant,
  children,
  withDescription,
  headerDescription,
  logo,
}) => {
  return (
    <>
      <HeaderTop variant={variant}>{logo}</HeaderTop>
      <HeaderMain withDescription={withDescription}>
        <HeaderTitle withDescription={withDescription}>{children}</HeaderTitle>
        {withDescription && (
          <HeaderDescription>{headerDescription}</HeaderDescription>
        )}
      </HeaderMain>
    </>
  );
};

Header.propTypes = {
  variant: PropType.string,
  children: PropType.node,
  withDescription: PropType.bool,
  headerDescription: PropType.string,
  logo: PropType.node,
};

Header.defaultProps = {
  type: "Header",
  variant: "Internal",
};

export default Header;
