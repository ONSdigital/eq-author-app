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
} from "components-themed/Toolkit";

const RecoverPassword = ({
  recoveryEmail,
  setRecoveryEmail,
  recoverPassword,
  forgotPassword,
  errorMessage,
  setErrorMessage,
  // recoveryEmailSent,
}) => {
  const [recoveryEmailSent, setRecoveryEmailSent] = useState(false);

  function handleReturnToSignInPage(e) {
    e.preventDefault();
    forgotPassword(false);
  }
  console.log("recoveryEmail", recoveryEmail);

  const handleEmailRecoveryPassword = async (recoveryEmail) => {
    console.log("recoveryEmail:::::", recoveryEmail);
    if (recoveryEmail === "" || recoverPassword === null) {
      setErrorMessage("Enter email");
    } else {
      try {
        await auth.sendPasswordResetEmail(recoveryEmail).then(function () {
          alert("Password reset link sent!");
        });
      } catch (err) {
        console.log("err:", err);
        console.error(err);
        setErrorMessage(err.message);
      }
      if (!errorMessage) {
        setRecoveryEmailSent(true);
        forgotPassword(true);
      }
    }
    console.log("errorMessage in recover PW page:", errorMessage);
  };

  function handleReturnToRecoverPassword(e) {
    e.preventDefault();
    forgotPassword(true);
    setRecoveryEmailSent(false);
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
            {errorMessage.toLowerCase().includes("email") ? (
              <>
                <Panel
                  variant="errorNoHeader"
                  paragraphLabel={errorMessage}
                  withLeftBorder
                >
                  <Label htmlFor="email">Enter your email address</Label>
                  <Input
                    type="text"
                    id="recoveryEmail"
                    value={recoveryEmail}
                    onChange={({ value }) => setRecoveryEmail(value)}
                    // onBlur={() => ()}
                    data-test="txt-recovery-email"
                    // validations={[required]}
                  />
                </Panel>
              </>
            ) : (
              <>
                <Label htmlFor="email">Enter your email address</Label>
                <Input
                  type="text"
                  id="recoveryEmail"
                  value={recoveryEmail}
                  onChange={({ value }) => setRecoveryEmail(value)}
                  // onBlur={() => ()}
                  data-test="txt-recovery-email"
                  // validations={[required]}
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
          <PageTitle>Recover Password - check your email</PageTitle>
          <Description>
            {`We've sent a link for resetting your password to` +
              recoveryEmail +
              `  The link will expire in X hours.`}
          </Description>
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
  forgotPassword: PropTypes.func,
  recoveryEmailSent: PropTypes.bool,
  errorMessage: PropTypes.string,
  setErrorMessage: PropTypes.func,
};

export default RecoverPassword;
