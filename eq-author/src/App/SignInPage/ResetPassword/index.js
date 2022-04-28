import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import auth from "components/Auth";
import { useHistory } from "react-router-dom";

import { Field } from "components/Forms";
import Button from "components-themed/buttons";
import Panel from "components-themed/panels";
import PasswordInput from "components-themed/Input/PasswordInput";
import passwordStrength from "../PasswordStrength";

import {
  PageTitle,
  Description,
  InlineDescription,
  InlineDescriptionBold,
} from "components-themed/Toolkit";

const ResetPassword = ({
  setForgotPassword,
  errorMessage,
  setErrorMessage,
  actionCode,
  resetThePassword,
  setPasswordResetSuccess,
  signOut,
}) => {
  const history = useHistory();

  const [userEmail, setUserEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [expired, setExpired] = useState(false);
  let errorRefPwReset = useRef();
  useEffect(() => {
    auth
      .verifyPasswordResetCode(actionCode)
      .then((email) => {
        setUserEmail(email);
      })
      .catch((error) => {
        // Invalid or expired action code. Ask user to try to reset the password again.
        setErrorMessage(error.message);
        setExpired(true);
      });
  }, [actionCode, userEmail, setErrorMessage]);

  const handleResetPassword = (newPassword) => {
    passwordStrength(newPassword).then((commonPassword) => {
      if (newPassword === "" || newPassword === null) {
        setErrorMessage("Password cannot be empty");
      } else if (newPassword.length < 8 && newPassword.length !== 0) {
        setErrorMessage("Your password must be at least 8 characters.");
      } else if (commonPassword) {
        setErrorMessage("Common phrases and passwords are not allowed.");
      } else {
        auth
          .confirmPasswordReset(actionCode, newPassword)
          .then(() => {
            setErrorMessage("");
            setExpired(false);
            // clear location variables
            history.replace({
              search: "",
            });
            setForgotPassword(false);
            resetThePassword(false);
            setPasswordResetSuccess(true);
            signOut();
          })
          .catch((error) => {
            setErrorMessage(error.message);
            setExpired(true);
          });
      }
    });
  };

  function handleReturnToSignInPage(e) {
    e.preventDefault();
    resetThePassword(false);
    setErrorMessage("");
    // clear location variables
    history.replace({
      search: "",
    });
    signOut();
  }

  function handleLinkToAnchor() {
    if (errorRefPwReset.current) {
      errorRefPwReset.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <>
      {actionCode && userEmail && !expired && (
        <>
          {errorMessage && (
            <Panel
              variant="errorWithHeader"
              headerLabel="This page has an error"
              paragraphLabel={errorMessage}
              withList
              handleLinkToAnchor={handleLinkToAnchor}
            />
          )}
          <PageTitle>Reset your Password</PageTitle>
          <InlineDescription>This is for the email:&nbsp;</InlineDescription>
          <InlineDescriptionBold>{userEmail}</InlineDescriptionBold>
          <InlineDescription>
            &nbsp;- Your password must be at least 8 characters.
          </InlineDescription>
          <Field>
            {errorMessage?.toLowerCase().includes("password") ? (
              <>
                <Panel
                  variant="errorNoHeader"
                  paragraphLabel={errorMessage}
                  withLeftBorder
                  innerRef={errorRefPwReset}
                >
                  <PasswordInput
                    id="new-password"
                    value={newPassword}
                    onChange={({ value }) => setNewPassword(value)}
                    data-test="txt-new-password"
                  />
                </Panel>
              </>
            ) : (
              <>
                <PasswordInput
                  id="new-password"
                  value={newPassword}
                  onChange={({ value }) => setNewPassword(value)}
                  data-test="txt-new-password"
                />
              </>
            )}
          </Field>
          <Field>
            <Button onClick={() => handleResetPassword(newPassword)}>
              Save
            </Button>
          </Field>
        </>
      )}

      {expired && (
        <>
          {errorMessage && (
            <Panel
              variant="errorWithHeader"
              headerLabel="This page has an error"
              paragraphLabel={errorMessage}
            />
          )}
          <PageTitle>Link expired or invalid</PageTitle>
          <Description>
            {`You will need to complete the "reset password" process again.`}
          </Description>
          <Field>
            <Button onClick={(e) => handleReturnToSignInPage(e)}>
              Return to sign in page
            </Button>
          </Field>
        </>
      )}
    </>
  );
};

ResetPassword.propTypes = {
  setForgotPassword: PropTypes.func,
  errorMessage: PropTypes.string,
  setErrorMessage: PropTypes.func,
  actionCode: PropTypes.string,
  resetThePassword: PropTypes.func,
  setPasswordResetSuccess: PropTypes.func,
  signOut: PropTypes.func,
};

export default ResetPassword;
