import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import auth from "components/Auth";

import {
  PageTitle,
  Description,
  CheckBoxField,
  CheckboxInput,
  ButtonLink,
} from "components-themed/Toolkit";
import PasswordInput from "components-themed/Input/PasswordInput";
import Input from "components-themed/Input";
import Button from "components-themed/buttons";
import Label, { OptionLabel } from "components-themed/Label";
import Panel from "components-themed/panels";

import { Form, Field } from "components/Forms";

const SignInForm = ({
  setForgotPassword,
  setCreateAccountFunction,
  errorMessage,
  setErrorMessage,
  passwordResetSuccess,
  setPasswordResetSuccess,
}) => {
  useEffect(() => {
    setPasswordResetSuccess(false);
  }, [setPasswordResetSuccess]);

  const logInWithEmailAndPassword = async (email, password) => {
    if (email === "") {
      setErrorMessage("Enter email");
    } else if (password === "") {
      setErrorMessage("Enter password");
    } else {
      try {
        await auth.signInWithEmailAndPassword(email, password);
      } catch (error) {
        setErrorMessage(error.message);
      }
      setForgotPassword(false);
    }
  };

  // const [loading, setLoading] = useState(false);
  // const [user, loading, error] = useAuthState(auth);
  // const [signInWithEmailAndPassword, user, loading, error] =
  //   useSignInWithEmailAndPassword(auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkbox, setCheckbox] = useState(false);

  function handleRecoverPassword(e) {
    e.preventDefault();
    setForgotPassword(true);
    setErrorMessage("");
  }

  function handleCreateAccount(e) {
    e.preventDefault();
    setCreateAccountFunction(true);
    setForgotPassword(false);
  }

  return (
    <>
      <Form>
        {errorMessage && (
          <Panel
            variant="errorWithHeader"
            headerLabel="This page has an error"
            paragraphLabel={errorMessage}
          />
        )}
        <PageTitle>Sign in</PageTitle>
        <Description>You must be signed in to access Author</Description>
        {passwordResetSuccess && (
          <Panel variant="success" headerLabel="boom" withLeftBorder>
            {
              "You've successfully updated the password for your Author account."
            }
          </Panel>
        )}

        <Field>
          {errorMessage.toLowerCase().includes("email") ? (
            <>
              <Panel
                variant="errorNoHeader"
                paragraphLabel={errorMessage}
                withLeftBorder
              >
                <Label htmlFor="email">Email address</Label>
                <Input
                  type="text"
                  id="email"
                  value={email}
                  onChange={({ value }) => setEmail(value)}
                  data-test="txt-email"
                  autocomplete="username"
                />
              </Panel>
            </>
          ) : (
            <>
              <Label htmlFor="email">Email address</Label>
              <Input
                type="text"
                id="email"
                value={email}
                onChange={({ value }) => setEmail(value)}
                data-test="txt-email"
                autocomplete="username"
              />
            </>
          )}
        </Field>
        <Field>
          {errorMessage.toLowerCase().includes("password") ? (
            <>
              <Panel
                variant="errorNoHeader"
                paragraphLabel={errorMessage}
                withLeftBorder
              >
                {/* <PasswordInput /> */}
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={({ value }) => setPassword(value)}
                  data-test="txt-password"
                  autocomplete="current-password"
                />
              </Panel>
            </>
          ) : (
            <>
              {/* <PasswordInput /> */}
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={({ value }) => setPassword(value)}
                data-test="txt-password"
                autocomplete="current-password"
              />
            </>
          )}
        </Field>
        <Field>
          <ButtonLink onClick={handleRecoverPassword}>
            Forgot your password?
          </ButtonLink>
        </Field>

        <CheckBoxField>
          <CheckboxInput
            type="checkbox"
            id="signIn-checkbox"
            name="signInCheckbox"
            checked={checkbox}
            onChange={({ checked }) => setCheckbox(checked)}
          />
          <OptionLabel htmlFor="signIn-checkbox">
            {"Keep me signed in"}
          </OptionLabel>
        </CheckBoxField>
        <Field>
          <Button
            // disabled={loading}
            onClick={() => logInWithEmailAndPassword(email, password)}
          >
            Sign in
          </Button>
        </Field>
        <ButtonLink onClick={handleCreateAccount}>
          Create an Author account
        </ButtonLink>
      </Form>
    </>
  );
};

SignInForm.defaultProps = {
  firebaseAuth: auth,
};

SignInForm.propTypes = {
  setForgotPassword: PropTypes.func,
  setCreateAccountFunction: PropTypes.func,
  errorMessage: PropTypes.string,
  setErrorMessage: PropTypes.func,
  passwordResetSuccess: PropTypes.bool,
  setPasswordResetSuccess: PropTypes.func,
};

export default SignInForm;
