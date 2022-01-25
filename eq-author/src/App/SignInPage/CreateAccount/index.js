import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import auth from "components/Auth";

import Input from "components-themed/Input";
import { Form, Field } from "components/Forms";
import Button from "components-themed/buttons";
import Label from "components-themed/Label";
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

  // const handleCreateAccount = async (createEmail, fullName, password) => {
  //   if (createEmail === "") {
  //     setErrorMessage("Enter email");
  //   } else if (fullName === "") {
  //     setErrorMessage("Enter password");
  //   } else if (password === "") {
  //     setErrorMessage("Enter password");
  //   } else {
  //     try {
  //       await auth.createUserWithEmailAndPassword(
  //         createEmail,
  //         fullName,
  //         password
  //       );
  //     } catch (err) {
  //       console.log("err", err);
  //       setErrorMessage(err.message);
  //       console.log("errorMessage in create acc page", errorMessage);
  //     }
  //     setForgotPassword(false);
  //   }
  // };

  const handleCreateAccount = async (createEmail, fullName, password) => {
    if (createEmail === "") {
      setErrorMessage("Enter email");
    } else if (fullName === "") {
      setErrorMessage("Enter password");
    } else if (password === "") {
      setErrorMessage("Enter password");
    } else {
      try {
        const response = await auth.createUserWithEmailAndPassword(
          createEmail,
          password
        );
        const user = response.user;
        console.log("response:", response);
        console.log("user:", user);
        // await addDoc(collection(db, "users"), {
        //   uid: user.uid,
        //   fullName,
        //   authProvider: "local",
        //   createEmail,
        // });
      } catch (err) {
        console.log("err", err);
        setErrorMessage(err.message);
        console.log("errorMessage in create acc page", errorMessage);
      }
      setForgotPassword(false);
    }
  };

  return (
    <>
      <Form>
        <PageTitle>Create an account</PageTitle>
        <Description>{`You must have an account to access Author`}</Description>
        <Field>
          <Label htmlFor="email">Email address</Label>
          <Input
            type="text"
            id="email"
            value={createEmail}
            onChange={({ value }) => setCreateEmail(value)}
            data-test="txt-recovery-email"
            autocomplete="username"
          />
        </Field>
        <Field>
          <Label htmlFor="email">First and last name</Label>
          <Input
            type="text"
            id="fullName"
            value={fullName}
            onChange={({ value }) => setFullName(value)}
            data-test="txt-recovery-email"
          />
        </Field>
        <Field>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="new-password"
            value={password}
            onChange={({ value }) => setPassword(value)}
            data-test="txt-new-password"
            autocomplete="new-password"
          />
        </Field>

        <Field>
          <Button
            onClick={() => handleCreateAccount(createEmail, fullName, password)}
          >
            Create account
          </Button>
        </Field>
        <InlineDescription>
          If you already have an account, you can
        </InlineDescription>
        <ButtonLink onClick={handleReturnToSignInPage}>sign in</ButtonLink>
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
