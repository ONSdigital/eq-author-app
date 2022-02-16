import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Redirect } from "react-router-dom";
import { withMe } from "App/MeContext";
import auth from "components/Auth";

import Loading from "components/Loading";
import styled from "styled-components";
import CustomPropTypes from "custom-prop-types";
import Layout from "components/Layout";
import { Grid, Column } from "components/Grid";

import SignInForm from "./SignInForm";
import RecoverPassword from "./RecoverPassword";
import ResetPassword from "./ResetPassword";
import CreateAccount from "./CreateAccount";
import EmailVerification from "./EmailVerification";
import ApiError from "./ApiError";

const MainPanel = styled.div`
  margin: 2em auto 0;
  display: flex;
  flex-direction: column;
`;

const SignInPage = ({
  me,
  signOut,
  isSigningIn,
  sentEmailVerification,
  searchParams,
}) => {
  const [createAccount, setCreateAccount] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [emailNowVerified, setEmailNowVerified] = useState(false);
  const [recoverPassword, setRecoverPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const [apiError, setApiError] = useState(false);

  // const [mode, setMode] = useState(null);
  const [actionCode, setActionCode] = useState("");

  const setForgotPassword = (boolVal) => {
    setRecoverPassword(boolVal);
  };
  const setCreateAccountFunction = (boolVal) => {
    setCreateAccount(boolVal);
  };
  const resetThePassword = (boolVal) => {
    setResetPassword(boolVal);
  };

  const verifyEmailAddress = async (actionCode) => {
    await auth
      .applyActionCode(actionCode)
      .then(() => {
        setErrorMessage("");
        setApiError(false);
        setEmailNowVerified(true);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setEmailNowVerified(false);
        setApiError(true);
      });
  };

  useEffect(() => {
    if (searchParams) {
      // getModeFromSearchParams(searchParams);

      const urlParams = new URLSearchParams(searchParams);
      const getParameterByName = (param) => urlParams.get(param);
      // Get the action to complete.
      //   setMode(getParameterByName("mode"));
      const mode = getParameterByName("mode");
      // Get the one-time code from the query parameter.
      setActionCode(getParameterByName("oobCode"));

      console.log("mode:", mode);
      console.log("apiError :>> ", apiError);

      if (mode === "resetPassword" && mode !== null) {
        resetThePassword(true);
        setErrorMessage("");
        return;
      } else if (mode === "verifyEmail" && mode !== null) {
        verifyEmailAddress(actionCode);
        return;
      } else if (mode !== null && mode !== "") {
        setErrorMessage("Invalid mode code returned from link");
        return;
      }

      // if (mode) {
      //   switch (mode) {
      //     case "resetPassword":
      //       resetThePassword(true);
      //       setErrorMessage("");
      //       break;
      //     case "verifyEmail":
      //       auth
      //         .applyActionCode(actionCode)
      //         .then(() => {
      //           // Email address has been verified.
      //           setErrorMessage("");
      //           setApiError(false);
      //           setEmailNowVerified(true);
      //         })
      //         .catch((error) => {
      //           setErrorMessage(error.message);
      //           setEmailNowVerified(false);
      //           setApiError(true);
      //         });
      //       break;
      //     default:
      //       setErrorMessage("Invalid mode code returned from link");
      //   }
      // }
    }
  }, [searchParams, apiError]);

  return (
    <>
      {me && <Redirect to="/" />}

      <Layout title="Author">
        <MainPanel>
          {isSigningIn && !sentEmailVerification && (
            <Loading height="38rem">Logging you in...</Loading>
          )}
          <Grid>
            <Column cols={8}>
              {!recoverPassword &&
                !createAccount &&
                !sentEmailVerification &&
                !resetPassword &&
                !isSigningIn &&
                !apiError && (
                  <SignInForm
                    recoverPassword={recoverPassword}
                    setForgotPassword={setForgotPassword}
                    setCreateAccountFunction={setCreateAccountFunction}
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                    passwordResetSuccess={passwordResetSuccess}
                    setPasswordResetSuccess={setPasswordResetSuccess}
                    emailNowVerified={emailNowVerified}
                    setEmailNowVerified={setEmailNowVerified}
                  />
                )}
              {recoverPassword && (
                <RecoverPassword
                  recoveryEmail={recoveryEmail}
                  setRecoveryEmail={setRecoveryEmail}
                  recoverPassword={recoverPassword}
                  setForgotPassword={setForgotPassword}
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
                />
              )}
              {resetPassword && (
                <ResetPassword
                  setForgotPassword={setForgotPassword}
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
                  actionCode={actionCode}
                  resetThePassword={resetThePassword}
                  setPasswordResetSuccess={setPasswordResetSuccess}
                  signOut={signOut}
                />
              )}
              {createAccount && (
                <CreateAccount
                  setCreateAccountFunction={setCreateAccountFunction}
                  setForgotPassword={setForgotPassword}
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
                  setVerificationEmail={setVerificationEmail}
                />
              )}
              {sentEmailVerification && !errorMessage && (
                <EmailVerification
                  verificationEmail={verificationEmail}
                  emailNowVerified={emailNowVerified}
                  setErrorMessage={setErrorMessage}
                  signOut={signOut}
                />
              )}
              {apiError && (
                <ApiError
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
                  setApiError={setApiError}
                  signOut={signOut}
                  verificationEmail={verificationEmail}
                />
              )}
            </Column>
          </Grid>
        </MainPanel>
      </Layout>
    </>
  );
};

SignInPage.propTypes = {
  me: CustomPropTypes.me,
  signOut: PropTypes.func,
  isSigningIn: PropTypes.bool,
  sentEmailVerification: PropTypes.bool,
  searchParams: PropTypes.string,
};

export default withMe(SignInPage);
