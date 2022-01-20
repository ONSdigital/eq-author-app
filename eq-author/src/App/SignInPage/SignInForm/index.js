import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { colors } from "constants/theme";
import auth, {
  logInWithEmailAndPassword,
  providers,
  credentialHelper,
} from "components/Auth";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { FirebaseAuth } from "react-firebaseui";

import {
  PageTitle,
  Description,
  CheckBoxField,
  CheckboxInput,
  OptionLabel,
  ButtonLink,
} from "components-themed/Toolkit";
import PasswordInput from "components-themed/Input/PasswordInput";
import Input from "components-themed/Input";
import Button from "components-themed/buttons";
import Label from "components-themed/Label";
import Panel from "components-themed/panels";

import { Form, Field } from "components/Forms";

const SignInForm = ({
  recoverPassword,
  forgotPassword,
  setCreateAccountFunction,
}) => {
  // const form = useRef();
  // const checkBtn = useRef();
  let errorMessage = null;
  const logInWithEmailAndPassword = async (email, password) => {
    console.log(`auth`, auth);
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
      errorMessage = err.message;
      console.error(err);
      alert(err.message);
    }
  };

  // const [loading, setLoading] = useState(false);
  // const [user, loading, error] = useAuthState(auth);
  // const [signInWithEmailAndPassword, user, loading, error] =
  //   useSignInWithEmailAndPassword(auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkbox, setCheckbox] = useState(false);

  // console.log(`user`, user);
  console.log(`errorMessage`, errorMessage);

  function handleRecoverPassword(e) {
    e.preventDefault();
    forgotPassword(true);
  }

  function handleCreateAccount(e) {
    e.preventDefault();
    setCreateAccountFunction(true);
    forgotPassword(false);
  }

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
      <Form>
        <PageTitle>Sign in</PageTitle>
        <Description>You must be signed in to access Author</Description>

        {/* <Panel variant="success" headerLabel="boom" withLeftBorder>
          {"You've successfully updated the password for your Author account."}
        </Panel> */}
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
          {/* <PasswordInput /> */}
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
  // uiConfig: {
  //   signInFlow: "popup",
  //   signInOptions: providers,
  //   credentialHelper,
  //   callbacks: {
  //     signInSuccessWithAuthResult: () => false, // Avoid redirects after sign-in.
  //   },
  // },
};

SignInForm.propTypes = {
  email: PropTypes.string,
  password: PropTypes.string,
  staySignedIn: PropTypes.bool,
  setRecoverPassword: PropTypes.func,
  setCreateAccountFunction: PropTypes.func,
};

export default SignInForm;
