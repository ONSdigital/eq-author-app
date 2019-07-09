import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { flowRight } from "lodash";
import { connect } from "react-redux";

import { signOutUser } from "redux/auth/actions";

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

const UserProfile = ({
  loading,
  data,
  error,
  signOutUser,
  client,
  ...otherProps
}) => {
  if (loading || !data || error) {
    return null;
  }
  const user = data.me;
  return (
    <Tooltip content="Sign Out">
      <LogoutButton
        onClick={() => {
          signOutUser();
          client.resetStore();
        }}
        variant="tertiary-light"
        small
        {...otherProps}
      >
        <UserAvatar
          src={user.picture || guestAvatar}
          alt=""
          role="presentation"
        />
        <UserName data-test="username">{user.displayName}</UserName>
      </LogoutButton>
    </Tooltip>
  );
};

UserProfile.propTypes = {
  signOutUser: PropTypes.func.isRequired,
  data: PropTypes.shape({
    user: CustomPropTypes.user,
  }),
  client: PropTypes.shape({
    resetStore: PropTypes.func.isRequired,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default flowRight(
  connect(
    null,
    { signOutUser }
  )
)(UserProfile);
