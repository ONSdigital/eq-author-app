import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import auth from "components/Auth";

import { Field } from "components/Forms";
import Button from "components-themed/buttons";
import Panel from "components-themed/panels";
import PasswordInput from "components-themed/Input/PasswordInput";

import PasswordStrength from "../PasswordStrength";

import {
  PageTitle,
  Description,
  InlineDescription,
  ButtonLink,
} from "components-themed/Toolkit";
import InputWithConditionalError from "../../../components/InputWithConditionalError";

const CreateAccount = ({
  setCreateAccountFunction,
  setForgotPassword,
  errorMessage,
  setErrorMessage,
  setVerificationEmail,
}) => {
  const [createEmail, setCreateEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  let errorRefCreateAcc = useRef();

  function handleReturnToSignInPage(e) {
    e.preventDefault();
    setCreateAccountFunction(false);
    setForgotPassword(false);
    setErrorMessage("");
  }

  const handleCreateAccount = async (createEmail, fullName, password) => {
    if (createEmail === "") {
      setErrorMessage("Enter email");
    } else if (fullName === "") {
      setErrorMessage("Enter full name");
    } else if (password.length < 8) {
      setErrorMessage("Your password must be at least 8 characters.");
    } else if (await PasswordStrength(password)) {
      setErrorMessage("Common phrases and passwords are not allowed.");
    } else if (password === "") {
      setErrorMessage("Enter password");
    } else {
      auth
        .createUserWithEmailAndPassword(createEmail, password)
        .then((response) => {
          response.user
            .updateProfile({
              displayName: fullName,
            })
            .then(
              function () {
                setVerificationEmail(createEmail);
                setErrorMessage("");
              },
              function (error) {
                setErrorMessage(error.message);
              }
            );
          setCreateAccountFunction(false);
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
      // try {
      //   const response = auth.createUserWithEmailAndPassword(
      //     createEmail,
      //     password
      //   );
      //   const user = response.user;
      //   user
      //     .updateProfile({
      //       displayName: fullName,
      //     })
      //     .then(
      //       function () {
      //         setVerificationEmail(createEmail);
      //         setErrorMessage("");
      //       },
      //       function (error) {
      //         setErrorMessage(error.message);
      //       }
      //     );
      //   setCreateAccountFunction(false);
      // } catch (error) {
      //   setErrorMessage(error.message);
      // }
    }
  };

  function handleLinkToAnchor() {
    if (errorRefCreateAcc.current) {
      errorRefCreateAcc.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <>
      <>
        {errorMessage && (
          <Panel
            variant="errorWithHeader"
            headerLabel="This page has an error"
            paragraphLabel={errorMessage}
            withList
            handleLinkToAnchor={handleLinkToAnchor}
          />
        )}
        <PageTitle>Create an account</PageTitle>
        <Description>{`You must have an account to access Author`}</Description>
        <InputWithConditionalError
          type="text"
          id="create-email"
          title="Email address"
          handleChange={({ value }) => setCreateEmail(value)}
          value={createEmail}
          condition={errorMessage?.toLowerCase().includes("email")}
          dataTest="txt-create-email"
          innerRef={errorRefCreateAcc}
        />
        <InputWithConditionalError
          type="text"
          id="create-fullName"
          title="First and last name"
          handleChange={({ value }) => setFullName(value)}
          value={fullName}
          condition={errorMessage?.toLowerCase().includes("name")}
          dataTest="txt-create-fullName"
          innerRef={errorRefCreateAcc}
        />
        <Field>
          {errorMessage?.toLowerCase().includes("password") ? (
            <>
              <Panel
                variant="errorNoHeader"
                paragraphLabel={errorMessage}
                withLeftBorder
                innerRef={errorRefCreateAcc}
              >
                <PasswordInput
                  id="create-password"
                  value={password}
                  onChange={({ value }) => setPassword(value)}
                  data-test="txt-create-password"
                />
              </Panel>
            </>
          ) : (
            <>
              <PasswordInput
                id="password"
                value={password}
                onChange={({ value }) => setPassword(value)}
                data-test="txt-create-password"
              />
            </>
          )}
        </Field>

        <Field>
          <Button
            onClick={() => handleCreateAccount(createEmail, fullName, password)}
          >
            Create account
          </Button>
        </Field>
        <InlineDescription>
          If you already have an account, you can&nbsp;
        </InlineDescription>
        <ButtonLink onClick={handleReturnToSignInPage}>sign in</ButtonLink>
      </>
    </>
  );
};

CreateAccount.propTypes = {
  setCreateAccountFunction: PropTypes.func,
  setForgotPassword: PropTypes.func,
  errorMessage: PropTypes.string,
  setErrorMessage: PropTypes.func,
  setVerificationEmail: PropTypes.func,
};

export default CreateAccount;
