import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import auth from "components/Auth";

import { Field } from "components/Forms";
import Button from "components-themed/buttons";
import Panel from "components-themed/panels";
import PasswordInput from "components-themed/Input/PasswordInput";
import isCommonPassword from "../CommonPassword";

import {
  PageTitle,
  Description,
  InlineDescription,
  ButtonLink,
} from "components-themed/Toolkit";
import InputWithConditionalError from "../../../components/InputWithConditionalError";

const CreateAccount = ({
  setCreateAccountFunction,
  setForgotPassword,
  errorMessage,
  errorMessageEmail,
  setErrorMessage,
  setErrorMessageEmail,
  setVerificationEmail,
}) => {
  const [createEmail, setCreateEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  let errorRefCreateAcc = useRef();
  const textValidEmailError = process.env.REACT_APP_ORGANISATION_ABBR
    ? "Enter a valid " + process.env.REACT_APP_ORGANISATION_ABBR + " email"
    : "Enter a valid authorised email";
  const textValidEmailErrorMessage = process.env.REACT_APP_ORGANISATION_ABBR
    ? "Enter a valid " +
      process.env.REACT_APP_ORGANISATION_ABBR +
      " email address"
    : "Enter a valid authorised email address";
  const textValidEmailDescription = process.env.REACT_APP_ORGANISATION_ABBR
    ? "Only " +
      process.env.REACT_APP_ORGANISATION_ABBR +
      " email addresses allowed"
    : "Only authorised email addresses allowed";

  function handleReturnToSignInPage(e) {
    e.preventDefault();
    setCreateAccountFunction(false);
    setForgotPassword(false);
    setErrorMessage("");
    setErrorMessageEmail("");
  }

  const endsWithAnyDomain = (email, domains) => {
    return domains.some((domain) => email.endsWith(domain));
  };

  const handleCreateAccount = (createEmail, fullName, password) => {
    isCommonPassword(password).then((commonPassword) => {
      if (createEmail === "") {
        setErrorMessage("Enter email");
      } else if (
        !endsWithAnyDomain(
          createEmail,
          process.env.REACT_APP_VALID_EMAIL_DOMAINS.split(",")
        )
      ) {
        setErrorMessage(textValidEmailError);
        setErrorMessageEmail(textValidEmailErrorMessage);
      } else if (fullName === "") {
        setErrorMessage("Enter full name");
      } else if (password.length < 8 && password.length !== 0) {
        setErrorMessage("Your password must be at least 8 characters.");
      } else if (commonPassword) {
        setErrorMessage("Common phrases and passwords are not allowed.");
      } else if (password === "") {
        setErrorMessage("Enter password");
      } else {
        auth
          .createUserWithEmailAndPassword(createEmail, password)
          .then((response) => {
            response.user
              .updateProfile({
                displayName: fullName,
              })
              .then(
                function () {
                  setVerificationEmail(createEmail);
                  setErrorMessage("");
                  setErrorMessageEmail("");
                },
                function (error) {
                  setErrorMessage(error.message);
                }
              );
            setCreateAccountFunction(false);
          })
          .catch((error) => {
            setErrorMessage(error.message);
          });
      }
    });
  };

  function handleLinkToAnchor() {
    if (errorRefCreateAcc.current) {
      errorRefCreateAcc.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Can use errorMessage.toLowerCase().includes("valid ONS email") (or similar) to conditionally render panel title
  return (
    <>
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
        <PageTitle>Create an account</PageTitle>
        <Description>{`You must have an account to access Author`}</Description>
        <InputWithConditionalError
          type="text"
          id="create-email"
          title="Email address"
          handleChange={({ value }) => setCreateEmail(value)}
          value={createEmail}
          condition={errorMessage?.toLowerCase().includes("email")}
          dataTest="txt-create-email"
          innerRef={errorRefCreateAcc}
          errorMessage={errorMessageEmail}
          description={textValidEmailDescription}
        />
        <InputWithConditionalError
          type="text"
          id="create-fullName"
          title="First and last name"
          handleChange={({ value }) => setFullName(value)}
          value={fullName}
          condition={errorMessage?.toLowerCase().includes("name")}
          dataTest="txt-create-fullName"
          innerRef={errorRefCreateAcc}
        />
        <Field>
          {errorMessage?.toLowerCase().includes("password") ? (
            <>
              <Panel
                variant="errorNoHeader"
                paragraphLabel={errorMessage}
                withLeftBorder
                innerRef={errorRefCreateAcc}
              >
                <PasswordInput
                  id="create-password"
                  value={password}
                  onChange={({ value }) => setPassword(value)}
                  data-test="txt-create-password"
                  description="Your password must be at least 8 characters"
                />
              </Panel>
            </>
          ) : (
            <>
              <PasswordInput
                id="password"
                value={password}
                onChange={({ value }) => setPassword(value)}
                data-test="txt-create-password"
                description="Your password must be at least 8 characters"
              />
            </>
          )}
        </Field>

        <Field>
          <Button
            onClick={() => handleCreateAccount(createEmail, fullName, password)}
          >
            Create account
          </Button>
        </Field>
        <InlineDescription>
          If you already have an account, you can&nbsp;
        </InlineDescription>
        <ButtonLink onClick={handleReturnToSignInPage}>sign in</ButtonLink>
      </>
    </>
  );
};

CreateAccount.propTypes = {
  setCreateAccountFunction: PropTypes.func,
  setForgotPassword: PropTypes.func,
  errorMessage: PropTypes.string,
  errorMessageEmail: PropTypes.string,
  setErrorMessage: PropTypes.func,
  setErrorMessageEmail: PropTypes.func,
  setVerificationEmail: PropTypes.func,
};

export default CreateAccount;
