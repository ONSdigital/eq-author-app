import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import Tooltip from "components/Tooltip";
import guestAvatar from "./icon-guest-avatar.svg";
import { colors } from "constants/theme";
import Button from "components/Button";

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

const UserProfile = ({ user, onSignOut, ...otherProps }) => (
  <Tooltip content="Sign Out">
    <LogoutButton
      onClick={onSignOut}
      variant="tertiary-light"
      small
      {...otherProps}
    >
      <UserAvatar
        src={user.photoURL || guestAvatar}
        alt=""
        role="presentation"
      />
      <UserName data-test="username">{user.displayName}</UserName>
    </LogoutButton>
  </Tooltip>
);

UserProfile.propTypes = {
  onSignOut: PropTypes.func.isRequired,
  user: CustomPropTypes.user.isRequired
};

export default UserProfile;
