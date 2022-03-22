import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { useMe } from "App/MeContext";

import Tooltip from "components/Forms/Tooltip";
import Button from "components/buttons/Button";

import IconText from "components/IconText";
import signOutIcon from "./signout-icon.svg?inline";

export const LogoutButton = styled(Button)`
  font-size: 1em;
  font-weight: 400;
  color: white;
  text-align: left;
  text-decoration: underline;
  &:hover {
    background: none;
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
        <LogoutButton
          data-test="signOut-btn"
          onClick={signOut}
          variant="tertiary-light"
          medium
        >
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
