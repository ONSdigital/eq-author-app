import React, { useState, useRef } from "react";
import styled from "styled-components";
import { colors } from "constants/theme";
import auth, { providers, credentialHelper } from "components/Auth";
import { FirebaseAuth } from "react-firebaseui";
import { darken } from "polished";

import Input from "components-themed/Input";
import { Form, Field } from "components/Forms";
import Button from "components-themed/buttons";
import Label from "components-themed/Label";

const H1Main = styled.h1`
  margin: 0 0 0.5rem;
`;

const TextMain = styled.p`
  margin: 0 0 1rem;
  font-size: 1.125rem;
`;

const Link = styled.a`
  margin: 0 0 1rem;
  font-size: 1.125rem;
  display: block;
`;

const CheckBoxField = styled(Field)`
  display: block;
  margin: 0;
  display: inline-flex;
  width: 100%;
  margin-left: 0;
`;

const CheckboxInput = styled(Input).attrs({ type: "checkbox" })`
  flex: 0 0 auto;
  margin-top: 0.05em;
`;

const OptionLabel = styled.p`
  margin: 0 0 1.5rem 0.5rem;
  align-items: flex-start;
  font-size: 1.125rem;
`;

const SignInForm = () => {
  const form = useRef();
  const checkBtn = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const required = (value) => {
    if (!value) {
      return (
        <div className="alert alert-danger" role="alert">
          This field is required!
        </div>
      );
    }
  };

  return (
    <>
      <H1Main>Sign in</H1Main>
      <TextMain>You must be signed in to access Author</TextMain>
      <Form ref={form}>
        <Field>
          <Label htmlFor="email">Email address</Label>
          <Input
            // type="text"
            id="email"
            value={email}
            onChange={({ value }) => setEmail(value)}
            // onBlur={() => ()}
            data-test="txt-email"
            // validations={[required]}
          />
        </Field>
        <Field>
          <Label htmlFor="password">Password</Label>
          <Input
            // type="password"
            id="password"
            value={password}
            onChange={({ value }) => setPassword(value)}
            // onBlur={() => ()}
            data-test="txt-password"
          />
        </Field>
        <Field>
          <Link href="#0">Forgot your password?</Link>
        </Field>

        <CheckBoxField>
          <CheckboxInput
            id="signIn-checkbox"
            name="singinCheckbox"
            // checked={selected}
            // onChange={onChange}
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

export default SignInForm;
