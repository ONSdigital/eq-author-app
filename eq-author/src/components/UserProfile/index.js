import React from "react";
import PropTypes from "prop-types";
import { flowRight } from "lodash";
import { withApollo } from "react-apollo";
import { withRouter } from "react-router-dom";

import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";

import { withMe } from "App/MeContext";

import Tooltip from "components/Forms/Tooltip";
import { colors } from "constants/theme";
import Button from "components/buttons/Button";

import guestAvatar from "./icon-guest-avatar.svg";

const UserAvatar = styled.img`
  border-radius: 50%;
  margin-right: 0.5em;
  width: 2em;
  height: 2em;
`;

const UserName = styled.span`
  line-height: 1.3;
  white-space: pre;
  font-weight: 400;
`;

export const LogoutButton = styled(Button)`
  padding: 0 1em 0 1px;
  border-radius: 2em;
  display: flex;
  align-items: center;
  font-size: 1em;
  border: none;
  background: none;
  color: white;
  text-align: left;

  &:hover {
    background: ${colors.white};
    color: ${colors.text};
  }
  &:focus {
    box-shadow: 0 0 0 3px ${colors.tertiary};
    outline: none;
  }
`;

const UserProfile = ({ me, signOut }) => {
  if (!me) {
    return null;
  }
  return (
    <Tooltip content="Sign Out">
      <LogoutButton
        onClick={() => {
          signOut();
        }}
        variant="tertiary-light"
        small
      >
        <UserAvatar
          src={me.picture || guestAvatar}
          alt=""
          role="presentation"
        />
        <UserName data-test="username">{me.displayName}</UserName>
      </LogoutButton>
    </Tooltip>
  );
};

UserProfile.propTypes = {
  client: PropTypes.shape({
    resetStore: PropTypes.func.isRequired,
  }).isRequired,
  me: CustomPropTypes.user,
  signOut: PropTypes.func.isRequired,
};

export default flowRight(withApollo, withMe, withRouter)(UserProfile);
