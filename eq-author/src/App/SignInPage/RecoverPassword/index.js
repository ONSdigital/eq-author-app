import React, { useState, useRef } from "react";
import PropTypes from "prop-types";

import Input from "components-themed/Input";
import { Field } from "components/Forms";
import Button from "components-themed/buttons";
import Label from "components-themed/Label";
import { PageTitle, Description, Link } from "components-themed/Toolkit";

const RecoverPassword = () => {
  const [recoveryEmail, setRecoveryEmail] = useState("");

  return (
    <>
      <PageTitle>Recover Password</PageTitle>
      <Description>
        {`Enter the email address you used to create your Author Account.
        We'll email you a link so you can reset your password.`}
      </Description>
      <Field>
        <Label htmlFor="email">Enter your email address</Label>
        <Input
          // type="text"
          id="email"
          value={recoveryEmail}
          onChange={({ value }) => setRecoveryEmail(value)}
          // onBlur={() => ()}
          data-test="txt-recovery-email"
          // validations={[required]}
        />
      </Field>

      <Field>
        <Button>Send</Button>
      </Field>
      <Link href="#0">Return to the sign in page </Link>
    </>
  );
};

RecoverPassword.propTypes = { recoveryEmail: PropTypes.string };

export default RecoverPassword;
