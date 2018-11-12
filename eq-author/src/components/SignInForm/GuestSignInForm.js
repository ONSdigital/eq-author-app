import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Button from "components/Button";
import { partial } from "lodash";

const displayName =
  process.env.NODE_ENV === "development" ? "Guesty McGuestFace" : "Guest";

const GUEST_USER = {
  displayName,
  email: "guest@example.org"
};

const GuestSignInButton = styled(Button)`
  margin-top: 1em;
`;

const GuestSignInForm = ({ onSignIn }) => (
  <GuestSignInButton primary onClick={partial(onSignIn, GUEST_USER)}>
    Sign in as Guest
  </GuestSignInButton>
);

GuestSignInForm.propTypes = {
  onSignIn: PropTypes.func.isRequired
};

export default GuestSignInForm;
