import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import CustomPropTypes from "custom-prop-types";
import { colors } from "constants/theme";

import { withMe } from "App/MeContext";

import UserProfile from "components/UserProfile";
import Truncated from "components/Truncated";
import Logo from "components/Logo";
import { Grid, Column } from "components/Grid";

const StyledHeader = styled(Grid)`
  background-color: ${colors.black};
  color: ${colors.white};
  font-weight: 400;
  flex: 0 1 auto;
  height: auto;
`;

const PageTitle = styled.div`
  overflow: hidden;
  white-space: pre;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const TruncatedTitle = Truncated.withComponent("h1");
const Title = styled(TruncatedTitle)`
  font-size: 1.2em;
  font-weight: 600;
  margin: 0;
  width: 100%;
  text-align: center;
  line-height: 1.3;
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

const Header = ({ title, me }) => (
  <StyledHeader>
    <Column cols={3}>
      <Logo />
    </Column>

    <Column cols={6}>
      <PageTitle>
        <Title>{title}</Title>
      </PageTitle>
    </Column>

    <Column cols={3}>
      {me && (
        <UserProfileWrapper>
          <StyledUserProfile currentUser={me} />
        </UserProfileWrapper>
      )}
    </Column>
  </StyledHeader>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
  me: CustomPropTypes.user,
};

export default withMe(Header);
