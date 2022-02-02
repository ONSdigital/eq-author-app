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
}) => {
  //use multiple state array here?
  const [createEmail, setCreateEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate("temp");
  });

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
      } catch (error) {
        setErrorMessage(error.message);
        console.log("errorMessage in create acc page", errorMessage);
      }
    }
  };

  // conditionally wrap the input with error component
  const ConditionalErrorWrapper = ({ condition, children }) => {
    console.log("condition:", condition);
    console.log("children", children);

    return (
      <>
        {condition ? (
          <Panel
            variant="errorNoHeader"
            paragraphLabel={errorMessage}
            withLeftBorder
          >
            {children}
          </Panel>
        ) : (
          <>{children}</>
        )}
      </>
    );
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

          {/* {errorMessage?.toLowerCase().includes("email") ? (
            <>
              <Panel
                variant="errorNoHeader"
                paragraphLabel={errorMessage}
                withLeftBorder
              >
                <Field>
                  <Label htmlFor="create-email">Email address</Label>
                  <Input
                    type="text"
                    id="create-email"
                    value={createEmail}
                    onChange={({ value }) => setCreateEmail(value)}
                    data-test="txt-create-email"
                    // autocomplete="off"
                  />
                </Field>
              </Panel>
            </>
          ) : (
            <>
              <Field>
                <Label htmlFor="create-email">Email address</Label>
                <Input
                  type="text"
                  id="create-email"
                  value={createEmail}
                  onChange={({ value }) => setCreateEmail(value)}
                  data-test="txt-create-email"
                  // autocomplete="off"
                />
              </Field>
            </>
          )} */}

          <AccountCreation
            id="create-fullName"
            title="First and last name"
            handleChange={({ value }) => setFullName(value)}
            value={fullName}
            condition={errorMessage?.toLowerCase().includes("name")}
            dataTest="txt-create-fullName"
          />

          {/*  <ConditionalErrorWrapper
            condition={errorMessage?.toLowerCase().includes("name")}
          >
            <Field>
              <Label htmlFor="create-fullName">First and last name</Label>
              <Input
                type="text"
                id="create-fullName"
                value={fullName}
                onChange={({ value }) => setFullName(value)}
                data-test="txt-create-fullName"
                // autocomplete="off"
              />
            </Field>
          </ConditionalErrorWrapper> */}

          <AccountCreation
            id="create-password"
            name="password"
            title="Password"
            handleChange={({ value }) => setPassword(value)}
            value={password}
            condition={errorMessage?.toLowerCase().includes("password")}
            dataTest="txt-create-password"
          />
          {/* <ConditionalErrorWrapper
            condition={errorMessage?.toLowerCase().includes("password")}
          >
            <>
              <Field>
                <Label htmlFor="create-password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="create-password"
                  value={password}
                  onChange={({ value }) => setPassword(value)}
                  data-test="txt-create-password"
                  // autocomplete="off"
                />
              </Field>
            </>
          </ConditionalErrorWrapper> */}

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
