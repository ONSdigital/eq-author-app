import React, { useState, useRef } from "react";
import PropTypes from "prop-types";

import { colors } from "constants/theme";
import auth, { providers, credentialHelper } from "components/Auth";
import { FirebaseAuth } from "react-firebaseui";

import {
  PageTitle,
  Description,
  Link,
  PasswordLink,
  CheckBoxField,
  CheckboxInput,
  OptionLabel,
} from "components-themed/Toolkit";
import PasswordInput from "components-themed/Input/PasswordInput";
import Input from "components-themed/Input";
import Button from "components-themed/buttons";
import Label from "components-themed/Label";
import Panel from "components-themed/panels";

import { Form, Field } from "components/Forms";

const SignInForm = () => {
  const form = useRef();
  const checkBtn = useRef();

  const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [checkbox, setCheckbox] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handling the email change
  // const handleEmail = (e) => {
  //   setEmail(e.target.value);
  //   setSubmitted(false);
  // };

  // // Handling the password change
  // const handlePassword = (e) => {
  //   setPassword(e.target.value);
  //   setSubmitted(false);
  // };

  // Handling the form submission
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (name === '' || email === '' || password === '') {
  //     setError(true);
  //   } else {
  //     setSubmitted(true);
  //     setError(false);
  //   }
  // };

  // const handleLogin = (e) => {
  //   e.preventDefault();

  //   setLoading(true);

  //   form.current.validateAll();

  //   if (checkBtn.current.context._errors.length === 0) {
  //     dispatch(login(username, password))
  //       .then(() => {
  //         props.history.push("/profile");
  //         window.location.reload();
  //       })
  //       .catch(() => {
  //         setLoading(false);
  //       });
  //   } else {
  //     setLoading(false);
  //   }
  // };

  // const required = (value) => {
  //   if (!value) {
  //     return (
  //       <div className="alert alert-danger" role="alert">
  //         This field is required!
  //       </div>
  //     );
  //   }
  // };

  return (
    <>
      <Form ref={form}>
        <PageTitle>Sign in</PageTitle>
        <Description>You must be signed in to access Author</Description>

        <Panel variant="success" headerLabel="boom" withLeftBorder>
          {"You've successfully updated the password for your Author account."}
        </Panel>
        <Field>
          <Label htmlFor="email">Email address</Label>
          <Input
            type="text"
            id="email"
            value={email}
            onChange={({ value }) => setEmail(value)}
            // onBlur={() => ()}
            data-test="txt-email"
            // validations={[required]}
          />
        </Field>
        <Field>
          <PasswordInput />
          {/* <Label htmlFor="password">Password</Label>
          <Input
            // type="password"
            id="password"
            value={password}
            onChange={({ value }) => setPassword(value)}
            // onBlur={() => ()}
            data-test="txt-password"
          /> */}
        </Field>
        <Field>
          <PasswordLink href="#0">Forgot your password?</PasswordLink>
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
          <Button disabled={loading}>Sign in</Button>
        </Field>
        <Link href="#0">Create an Author account </Link>
      </Form>
    </>
  );
};

SignInForm.defaultProps = {
  firebaseAuth: auth,
  uiConfig: {
    signInFlow: "popup",
    signInOptions: providers,
    credentialHelper,
    callbacks: {
      signInSuccessWithAuthResult: () => false, // Avoid redirects after sign-in.
    },
  },
};

SignInForm.propTypes = {
  email: PropTypes.string,
  password: PropTypes.string,
  staySignedIn: PropTypes.bool,
};

export default SignInForm;
