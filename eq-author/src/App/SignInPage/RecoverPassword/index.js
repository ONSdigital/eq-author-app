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
  Link,
  InlineDescription,
  InlineLink,
} from "components-themed/Toolkit";

const RecoverPassword = ({
  recoveryEmail,
  setRecoveryEmail,
  recoverPassword,
  recoveryEmailSent,
}) => {
  return (
    <>
      {recoverPassword && (
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
            <Button>Send</Button>
          </Field>
          <Link href="#0">Return to the sign in page </Link>
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
          <InlineLink href="#0">send the password reset email again</InlineLink>
          <InlineDescription>if you did not get it.</InlineDescription>
        </>
      )}
    </>
  );
};

RecoverPassword.propTypes = {
  recoveryEmail: PropTypes.string,
  setRecoveryEmail: PropTypes.func,
  recoverPassword: PropTypes.bool.isRequired,
  recoveryEmailSent: PropTypes.bool.isRequired,
};

export default RecoverPassword;
