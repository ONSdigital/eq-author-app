import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import auth from "components/Auth";
import { useHistory } from "react-router-dom";

import Input from "components-themed/Input";
import { Field } from "components/Forms";
import Button from "components-themed/buttons";
import Label from "components-themed/Label";
import Panel from "components-themed/panels";

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

  const handleResetPassword = async (newPassword) => {
    if (newPassword === "" || newPassword === null) {
      setErrorMessage("Password cannot be empty");
    } else {
      try {
        await auth
          .confirmPasswordReset(actionCode, newPassword)
          .then(function () {
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
          });
      } catch (error) {
        setErrorMessage(error.message);
        setExpired(true);
      }
    }
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

  return (
    <>
      {actionCode && userEmail && !expired && (
        <>
          {errorMessage && (
            <Panel
              variant="errorWithHeader"
              headerLabel="This page has an error"
              paragraphLabel={errorMessage}
            />
          )}
          <PageTitle>Reset your Password</PageTitle>
          <InlineDescription>{"This is for the email:"}</InlineDescription>
          <InlineDescriptionBold>{userEmail}</InlineDescriptionBold>
          <InlineDescription>
            {" - Your password must be at least 8 characters."}
          </InlineDescription>
          <Field>
            {errorMessage?.toLowerCase().includes("password") ? (
              <>
                <Panel
                  variant="errorNoHeader"
                  paragraphLabel={errorMessage}
                  withLeftBorder
                >
                  <Label htmlFor="new-password">Enter a new password</Label>
                  <Input
                    type="password"
                    id="new-password"
                    value={newPassword}
                    onChange={({ value }) => setNewPassword(value)}
                    data-test="txt-new-password"
                  />
                </Panel>
              </>
            ) : (
              <>
                <Label htmlFor="new-password">Enter a new password</Label>
                <Input
                  type="password"
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
