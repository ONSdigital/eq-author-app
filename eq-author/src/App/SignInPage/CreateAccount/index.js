import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

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

const CreateAccount = ({ setCreateAccountFunction, setForgotPassword }) => {
  //use multiple state array here?
  const [createEmail, setCreateEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  function handleReturnToSignInPage(e) {
    e.preventDefault();
    setCreateAccountFunction(false);
    setForgotPassword(false);
  }

  return (
    <>
      <Form>
        <PageTitle>Create an account</PageTitle>
        <Description>{`You must have an account to access Author`}</Description>
        <Field>
          <Label htmlFor="email">Email address</Label>
          <Input
            // type="text"
            id="email"
            value={createEmail}
            onChange={({ value }) => setCreateEmail(value)}
            // onBlur={() => ()}
            data-test="txt-recovery-email"
            // validations={[required]}
          />
        </Field>
        <Field>
          <Label htmlFor="email">First name</Label>
          <Input
            // type="text"
            id="firstName"
            value={firstName}
            onChange={({ value }) => setFirstName(value)}
            // onBlur={() => ()}
            data-test="txt-recovery-email"
            // validations={[required]}
          />
        </Field>
        <Field>
          <Label htmlFor="email">Last name</Label>
          <Input
            // type="text"
            id="lastName"
            value={lastName}
            onChange={({ value }) => setLastName(value)}
            // onBlur={() => ()}
            data-test="txt-recovery-email"
            // validations={[required]}
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
          <Button>Create account</Button>
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
};

export default CreateAccount;
