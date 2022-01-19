import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Input from "components-themed/Input";
import { Field } from "components/Forms";
import Button from "components-themed/buttons";
import Label from "components-themed/Label";
import {
  PageTitle,
  Description,
  InlineDescription,
  ButtonLink,
} from "components-themed/Toolkit";

const CreateAccount = ({ setCreateAccountFunction, forgotPassword }) => {
  //use multiple state array here?
  const [createEmail, setCreateEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  function handleReturnToSignInPage(e) {
    e.preventDefault();
    setCreateAccountFunction(false);
    forgotPassword(false);
  }

  return (
    <>
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
          // type="password"
          id="password"
          value={password}
          onChange={({ value }) => setPassword(value)}
          // onBlur={() => ()}
          data-test="txt-password"
        />
      </Field>

      <Field>
        <Button>Create account</Button>
      </Field>
      <InlineDescription>
        If you already have an account, you can
      </InlineDescription>
      <ButtonLink onClick={handleReturnToSignInPage}>sign in</ButtonLink>
    </>
  );
};

CreateAccount.propTypes = {
  recoveryEmail: PropTypes.string,
  setCreateAccountFunction: PropTypes.func,
  forgotPassword: PropTypes.func,
};

export default CreateAccount;
