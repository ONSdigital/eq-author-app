import React from "react";
import propTypes from "prop-types";
import { useHistory } from "react-router-dom";

import { Field } from "components/Forms";
import Button from "components-themed/buttons";
import {
  PageTitle,
  InlineDescription,
  InlineDescriptionBold,
} from "components-themed/Toolkit";

const EmailVerification = ({
  verificationEmail,
  emailNowVerified,
  setErrorMessage,
  signOut,
}) => {
  const history = useHistory();

  function handleReturnToSignInPage(e) {
    e.preventDefault();
    setErrorMessage("");
    // clear location variables
    history.replace({
      search: "",
    });
    signOut();
  }

  return (
    <>
      {emailNowVerified ? (
        <>
          <PageTitle>Email verification</PageTitle>
          <InlineDescription>
            {"Your email has been successfully verified. You can now sign in."}
          </InlineDescription>
          <InlineDescriptionBold>{verificationEmail}</InlineDescriptionBold>
          <InlineDescription>{""}</InlineDescription>
          <Field>
            <Button onClick={(e) => handleReturnToSignInPage(e)}>
              Return to sign in page
            </Button>
          </Field>
        </>
      ) : (
        <>
          <PageTitle>Email verification</PageTitle>
          <InlineDescription>
            {
              "You need to confirm your email address to sign in. Click on the confirmation link we've emailed to:"
            }
          </InlineDescription>
          <InlineDescriptionBold>{verificationEmail}</InlineDescriptionBold>
          <Field>
            <Button onClick={(e) => handleReturnToSignInPage(e)}>
              Return to the sign in page
            </Button>
          </Field>
        </>
      )}
    </>
  );
};

EmailVerification.propTypes = {
  verificationEmail: propTypes.string,
  emailNowVerified: propTypes.bool,
  setErrorMessage: propTypes.func,
  signOut: propTypes.func,
};

export default EmailVerification;
