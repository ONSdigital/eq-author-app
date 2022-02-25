import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { useMe } from "App/MeContext";

import Tooltip from "components/Forms/Tooltip";
import { colors } from "constants/theme";
import Button from "components/buttons/Button";

import IconText from "components/IconText";
import guestAvatar from "./icon-guest-avatar.svg";
import signOutIcon from "./signout-icon.svg?inline";

const UserAvatar = styled.img`
  border-radius: 50%;
  margin-right: 0.5em;
  width: 2em;
  height: 2em;
  fill: var(--color-text);
  text-align: center;
`;

const UserName = styled.span`
  line-height: 1.3;
  white-space: pre;
  font-weight: 400;
`;

export const LogoutButton = styled(Button)`
  font-size: 1em;
  font-weight: 400;
  color: white;
  text-align: left;
  text-decoration: underline;
  &:hover {
    background: none;
    /* color: ${colors.text}; */
  }
  &:focus {
    box-shadow: none;
    outline: none;
  }
`;

export const NavLogoutButton = styled(Button)`
  text-align: centre;
`;

const UserProfile = ({ nav }) => {
  const { me, signOut } = useMe();

  if (!me) {
    return null;
  }

  return (
    <Tooltip content="Sign Out">
      {nav ? (
        <NavLogoutButton onClick={signOut} variant="navigation" small>
          <IconText nav icon={signOutIcon}>
            Sign out
          </IconText>
        </NavLogoutButton>
      ) : (
        <LogoutButton onClick={signOut} variant="tertiary-light" medium>
          Sign Out
        </LogoutButton>
      )}
    </Tooltip>
  );
};

UserProfile.propTypes = {
  nav: PropTypes.bool,
};

export default UserProfile;
