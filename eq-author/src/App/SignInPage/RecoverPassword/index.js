import React, { useState, useRef } from "react";
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
  altRecoverPassword,
}) => {
  const [recoveryEmailSent, setRecoveryEmailSent] = useState(false);
  let errorRefPwRecover = useRef();

  function handleReturnToSignInPage(e) {
    e.preventDefault();
    setForgotPassword(false);
    setErrorMessage("");
  }

  const handleEmailRecoveryPassword = (recoveryEmail) => {
    if (recoveryEmail === "" || recoveryEmail === null) {
      setErrorMessage("Email should not be empty");
    } else {
      auth
        .sendPasswordResetEmail(recoveryEmail)
        .then(() => {
          setRecoveryEmailSent(true);
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    }
  };

  function handleReturnToRecoverPassword(e) {
    e.preventDefault();
    setForgotPassword(true);
    setRecoveryEmailSent(false);
    setErrorMessage("");
  }

  function handleLinkToAnchor() {
    if (errorRefPwRecover.current) {
      errorRefPwRecover.current.scrollIntoView({ behavior: "smooth" });
    }
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
              withList
              handleLinkToAnchor={handleLinkToAnchor}
            />
          )}
          {altRecoverPassword ? (
            <PageTitle>Reset Password</PageTitle>
          ) : (
            <PageTitle>Recover Password</PageTitle>
          )}
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
                  innerRef={errorRefPwRecover}
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
          <Field>
            <ButtonLink onClick={handleReturnToSignInPage}>
              Return to the sign in page
            </ButtonLink>
          </Field>
        </>
      )}

      {recoveryEmailSent && (
        <>
          <Panel variant="success" headerLabel="boom" withLeftBorder>
            {"Password reset sent."}
          </Panel>
          <PageTitle>Recover Password - check your email</PageTitle>
          <InlineDescription>
            We&rsquo;ve sent a link for resetting your password to:&nbsp;
          </InlineDescription>
          <InlineDescriptionBold>{recoveryEmail}</InlineDescriptionBold>
          <InlineDescription>
            The link will expire in 2 hours.
          </InlineDescription>

          <PageSubTitle>If you did not get the email</PageSubTitle>
          <InlineDescription>We can&nbsp;</InlineDescription>
          <ButtonLink onClick={handleReturnToRecoverPassword}>
            send the password reset email again&nbsp;
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
  altRecoverPassword: PropTypes.bool,
};

export default RecoverPassword;
