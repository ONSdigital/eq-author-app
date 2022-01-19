import React, { useState } from "react";
import PropTypes from "prop-types";

import Input from "components-themed/Input";
import { Field } from "components/Forms";
import Button from "components-themed/buttons";
import Label from "components-themed/Label";
import {
  PageTitle,
  PageSubTitle,
  Description,
  ButtonLink,
  InlineDescription,
  InlineLink,
} from "components-themed/Toolkit";

const RecoverPassword = ({
  recoveryEmail,
  setRecoveryEmail,
  recoverPassword,
  forgotPassword,
  // recoveryEmailSent,
}) => {
  const [recoveryEmailSent, setRecoveryEmailSent] = useState(false);

  function handleReturnToSignInPage(e) {
    e.preventDefault();
    forgotPassword(false);
  }

  function handleEmail(e) {
    e.preventDefault();
    // handle sending email for PW recovery here!
    setRecoveryEmailSent(true);
    forgotPassword(true);
  }

  function handleRecoverPassword(e) {
    e.preventDefault();
    forgotPassword(true);
    setRecoveryEmailSent(false);
  }

  return (
    <>
      {recoverPassword && !recoveryEmailSent && (
        <>
          <PageTitle>Recover Password</PageTitle>
          <Description>
            {`Enter the email address you used to create your Author Account.
        We'll email you a link so you can reset your password.`}
          </Description>
          <Field>
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
          </Field>

          <Field>
            <Button onClick={handleEmail}>Send</Button>
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
            {/* might not have the me context here as not yet signed in?? */}
            {`We've sent a link for resetting your password to me.email.  The link will expire in X hours.`}
          </Description>
          <PageSubTitle>If you did not get the email</PageSubTitle>
          <InlineDescription>We can</InlineDescription>
          <ButtonLink onClick={handleRecoverPassword}>
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
};

export default RecoverPassword;
