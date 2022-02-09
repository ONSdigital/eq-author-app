import React, { useState } from "react";
import PropTypes from "prop-types";
import auth from "components/Auth";

import Input from "components-themed/Input";
import { Field } from "components/Forms";
import Button from "components-themed/buttons";
import Label from "components-themed/Label";
import Panel from "components-themed/panels";

import {
  PageTitle,
  PageSubTitle,
  Description,
  ButtonLink,
  InlineDescription,
  InlineDescriptionBold,
} from "components-themed/Toolkit";

const RecoverPassword = ({
  recoveryEmail,
  setRecoveryEmail,
  recoverPassword,
  setForgotPassword,
  errorMessage,
  setErrorMessage,
}) => {
  const [recoveryEmailSent, setRecoveryEmailSent] = useState(false);

  function handleReturnToSignInPage(e) {
    e.preventDefault();
    setForgotPassword(false);
    setErrorMessage("");
  }

  const handleEmailRecoveryPassword = async (recoveryEmail) => {
    console.log("object here 1!!!:>> ", recoveryEmail);
    if (recoveryEmail === "" || recoveryEmail === null) {
      setErrorMessage("Email should not be empty");
    } else {
      try {
        await auth.sendPasswordResetEmail(recoveryEmail).then(function () {
          console.log("object here 2!!!:>> ");

          setRecoveryEmailSent(true);
        });
      } catch (error) {
        console.log("err :>> ", error);
        setErrorMessage(error.message);
      }
    }
  };

  function handleReturnToRecoverPassword(e) {
    e.preventDefault();
    setForgotPassword(true);
    setRecoveryEmailSent(false);
    setErrorMessage("");
  }

  return (
    <>
      {recoverPassword && !recoveryEmailSent && (
        <>
          {errorMessage && (
            <Panel
              variant="errorWithHeader"
              headerLabel="This page has an error"
              paragraphLabel={errorMessage}
            />
          )}
          <PageTitle>Recover Password</PageTitle>
          <Description>
            {`Enter the email address you used to create your Author Account.
        We'll email you a link so you can reset your password.`}
          </Description>
          <Field>
            {errorMessage?.toLowerCase().includes("email") ||
            errorMessage?.toLowerCase().includes("user") ? (
              <>
                <Panel
                  variant="errorNoHeader"
                  paragraphLabel={errorMessage}
                  withLeftBorder
                >
                  <Label htmlFor="recoveryEmail">
                    Enter your email address
                  </Label>
                  <Input
                    type="text"
                    id="recoveryEmail"
                    value={recoveryEmail}
                    onChange={({ value }) => setRecoveryEmail(value)}
                    data-test="txt-recovery-email"
                  />
                </Panel>
              </>
            ) : (
              <>
                <Label htmlFor="recoveryEmail">Enter your email address</Label>
                <Input
                  type="text"
                  id="recoveryEmail"
                  value={recoveryEmail}
                  onChange={({ value }) => setRecoveryEmail(value)}
                  data-test="txt-recovery-email"
                />
              </>
            )}
          </Field>

          <Field>
            <Button onClick={() => handleEmailRecoveryPassword(recoveryEmail)}>
              Send
            </Button>
          </Field>
          <ButtonLink onClick={handleReturnToSignInPage}>
            Return to the sign in page
          </ButtonLink>
        </>
      )}

      {recoveryEmailSent && (
        <>
          <Panel variant="success" headerLabel="boom" withLeftBorder>
            {"Password reset sent."}
          </Panel>
          <PageTitle>Recover Password - check your email</PageTitle>
          <InlineDescription>
            {"We've sent a link for resetting your password to:"}
          </InlineDescription>
          <InlineDescriptionBold>{recoveryEmail}</InlineDescriptionBold>
          <InlineDescription>
            {"The link will expire in 2 hours."}
          </InlineDescription>

          <PageSubTitle>If you did not get the email</PageSubTitle>
          <InlineDescription>We can</InlineDescription>
          <ButtonLink onClick={handleReturnToRecoverPassword}>
            send the password reset email again
          </ButtonLink>
          <InlineDescription>if you did not get it.</InlineDescription>
        </>
      )}
    </>
  );
};

RecoverPassword.propTypes = {
  recoveryEmail: PropTypes.string,
  setRecoveryEmail: PropTypes.func,
  recoverPassword: PropTypes.bool,
  setForgotPassword: PropTypes.func,
  recoveryEmailSent: PropTypes.bool,
  errorMessage: PropTypes.string,
  setErrorMessage: PropTypes.func,
};

export default RecoverPassword;
