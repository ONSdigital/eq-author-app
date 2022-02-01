import React from "react";
import propTypes from "prop-types";

import { Form, Field } from "components/Forms";
import Button from "components-themed/buttons";
import { PageTitle, Description } from "components-themed/Toolkit";

const EmailVerification = ({ signOut }) => {
  function handleReturnToSignInPage(e) {
    e.preventDefault();
    signOut();
  }

  return (
    <>
      <Form>
        <PageTitle>Email verification</PageTitle>
        <Description>{`You need to confirm your email address to sign in. Click on the confirmation link we've emailed to (EMAIL ADDY HERE)`}</Description>
        <Field>
          <Button onClick={(e) => handleReturnToSignInPage(e)}>
            Return to sign in page
          </Button>
        </Field>
      </Form>
    </>
  );
};

EmailVerification.propTypes = {
  signOut: propTypes.func,
  email: propTypes.string,
};

export default EmailVerification;
