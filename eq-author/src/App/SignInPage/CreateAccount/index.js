import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import auth from "components/Auth";

import Input from "components-themed/Input";
import { Form, Field } from "components/Forms";
import Button from "components-themed/buttons";
import Label from "components-themed/Label";
import Panel from "components-themed/panels";

import {
  PageTitle,
  Description,
  InlineDescription,
  ButtonLink,
} from "components-themed/Toolkit";
import AccountCreation from "../../../components/AccountCreation";

const CreateAccount = ({
  setCreateAccountFunction,
  setForgotPassword,
  errorMessage,
  setErrorMessage,
  setVerificationEmail,
}) => {
  //use multiple state array here?
  const [createEmail, setCreateEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  function handleReturnToSignInPage(e) {
    e.preventDefault();
    setCreateAccountFunction(false);
    setForgotPassword(false);
  }

  const handleCreateAccount = async (createEmail, fullName, password) => {
    if (createEmail === "") {
      setErrorMessage("Enter email");
    } else if (fullName === "") {
      setErrorMessage("Enter full name");
    } else if (password === "") {
      setErrorMessage("Enter password");
    } else {
      try {
        const response = await auth.createUserWithEmailAndPassword(
          createEmail,
          password
        );
        const user = response.user;
        user
          .updateProfile({
            displayName: fullName,
          })
          .then(
            function () {
              setVerificationEmail(createEmail);
              setErrorMessage("");
            },
            function (error) {
              setErrorMessage(error.message);
            }
          );
        setCreateAccountFunction(false);
      } catch (error) {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <>
      <Form>
        <>
          {errorMessage && (
            <Panel
              variant="errorWithHeader"
              headerLabel="This page has an error"
              paragraphLabel={errorMessage}
            />
          )}
          <PageTitle>Create an account</PageTitle>
          <Description>{`You must have an account to access Author`}</Description>

          <AccountCreation
            id="create-email"
            title="Email address"
            handleChange={({ value }) => setCreateEmail(value)}
            value={createEmail}
            condition={errorMessage?.toLowerCase().includes("email")}
            dataTest="txt-create-email"
          />

          <AccountCreation
            id="create-fullName"
            title="First and last name"
            handleChange={({ value }) => setFullName(value)}
            value={fullName}
            condition={errorMessage?.toLowerCase().includes("name")}
            dataTest="txt-create-fullName"
          />

          <AccountCreation
            id="create-password"
            name="password"
            title="Password"
            handleChange={({ value }) => setPassword(value)}
            value={password}
            condition={errorMessage?.toLowerCase().includes("password")}
            dataTest="txt-create-password"
          />

          <Field>
            <Button
              onClick={() =>
                handleCreateAccount(createEmail, fullName, password)
              }
            >
              Create account
            </Button>
          </Field>
          <InlineDescription>
            If you already have an account, you can
          </InlineDescription>
          <ButtonLink onClick={handleReturnToSignInPage}>sign in</ButtonLink>
        </>
      </Form>
    </>
  );
};

CreateAccount.propTypes = {
  setCreateAccountFunction: PropTypes.func,
  setForgotPassword: PropTypes.func,
  errorMessage: PropTypes.string,
  setErrorMessage: PropTypes.func,
  setVerificationEmail: PropTypes.func,
};

export default CreateAccount;
