import React from "react";
import styled from "styled-components";
import PropType from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { Grid, Column } from "components/Grid";
import UserProfile from "components/UserProfile";
import { withMe } from "App/MeContext";

const HeaderTop = styled.div`
  background-color: ${({ theme, variant }) =>
    variant === "Internal"
      ? theme.colors.internalHeaderTop
      : theme.colors.externalHeaderTop};
  padding-top: 5px;
  height: 56px;
  min-height: 36px;
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
  margin: 0 0 0.5rem;
`;

const HeaderTitle = styled.div`
  font-size: 1.6666666667rem;
  color: ${({ theme }) => theme.colors.headerTitle};
  font-weight: 700;
  line-height: 1.4;
  margin-top: 0;
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

const StyledUserProfile = styled(UserProfile)`
  width: auto;
  margin-right: 0.5em;
`;

const UserProfileWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Header = ({
  variant,
  children,
  headerDescription,
  logo,
  headerTopContent,
  me,
}) => {
  return (
    <>
      <HeaderTop variant={variant}>
        <Grid align="center" horizontalAlign="center">
          <Column cols={9}>
            <Grid align="center">
              <Column cols={9}>
                {logo}
                {headerTopContent}
              </Column>
              <Column cols={3}>
                {me && (
                  <UserProfileWrapper>
                    <StyledUserProfile currentUser={me} />
                  </UserProfileWrapper>
                )}
              </Column>
            </Grid>
          </Column>
        </Grid>
      </HeaderTop>
      <HeaderMain headerDescription={headerDescription}>
        <Grid horizontalAlign="center">
          <Column cols={9}>
            <Grid align="center">
              <Column cols={9}>
                <HeaderTitle headerDescription={headerDescription}>
                  {children}
                </HeaderTitle>
                {headerDescription && (
                  <HeaderDescription>{headerDescription}</HeaderDescription>
                )}
              </Column>
            </Grid>
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
  me: CustomPropTypes.user,
};

Header.defaultProps = {
  variant: "Internal",
};

export default withMe(Header);
