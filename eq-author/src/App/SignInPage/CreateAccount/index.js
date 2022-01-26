import React, { useState } from "react";
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

const CreateAccount = ({
  setCreateAccountFunction,
  setForgotPassword,
  errorMessage,
  setErrorMessage,
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
              console.log("sucess in update username");
            },
            function (error) {
              console.log("error in update username", error);
            }
          );

        console.log("user:", user);

        setCreateAccountFunction(false);
      } catch (err) {
        console.log("err", err);
        setErrorMessage(err.message);
        console.log("errorMessage in create acc page", errorMessage);
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
          <Field>
            <Label htmlFor="create-email">Email address</Label>
            <Input
              type="text"
              id="create-email"
              value={createEmail}
              onChange={({ value }) => setCreateEmail(value)}
              data-test="txt-create-email"
              autocomplete="username"
            />
          </Field>
          <Field>
            <Label htmlFor="create-fullName">First and last name</Label>
            <Input
              type="text"
              id="create-fullName"
              value={fullName}
              onChange={({ value }) => setFullName(value)}
              data-test="txt-create-fullName"
            />
          </Field>
          <Field>
            <Label htmlFor="create-password">Password</Label>
            <Input
              type="password"
              id="create-password"
              value={password}
              onChange={({ value }) => setPassword(value)}
              data-test="txt-create-password"
              autocomplete="new-password"
            />
          </Field>

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
};

export default CreateAccount;
