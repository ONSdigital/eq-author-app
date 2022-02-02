import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Redirect } from "react-router-dom";
import { withMe } from "App/MeContext";

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

const MainPanel = styled.div`
  margin: 2em auto 0;
  display: flex;
  flex-direction: column;
`;

const SignInPage = ({
  me,
  signIn,
  signOut,
  isSigningIn,
  sentEmailVerification,
  location,
  // todo - do we need this???
  // sentPasswordResetEmail
}) => {
  // const parameters = localStorage.getItem("locationSearch");

  const [createAccount, setCreateAccount] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [recoverPassword, setRecoverPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

  const [mode, setMode] = useState("");
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

  useEffect(() => {
    // do we have a link from email in the url?
    if (location?.search) {
      const urlParams = new URLSearchParams(location.search);
      const getParameterByName = (param) => urlParams.get(param);
      // Get the action to complete.
      setMode(getParameterByName("mode"));
      // Get the one-time code from the query parameter.
      setActionCode(getParameterByName("oobCode"));
      // (Optional) Get the continue URL from the query parameter if available.

      switch (mode) {
        case "resetPassword":
          resetThePassword(true);
          break;
        case "recoverEmail":
          console.log("here at recoverEmail");
          break;
        case "verifyEmail":
          console.log("here at recoverEmail");
          // handleVerifyEmail(auth, actionCode, continueUrl, lang);
          break;
        default:
          setErrorMessage("Invalid mode code returned from link");
      }
    }
  }, [location.search, mode]);

  return (
    <>
      {me && <Redirect to="/" />}

      <Layout title="Author">
        <MainPanel>
          <Grid>
            <Column cols={9}>
              {isSigningIn && (
                <Loading height="38rem">Logging you in...</Loading>
              )}

              {!recoverPassword &&
                !createAccount &&
                !sentEmailVerification &&
                !resetPassword &&
                !isSigningIn && (
                  <SignInForm
                    recoverPassword={recoverPassword}
                    setForgotPassword={setForgotPassword}
                    setCreateAccountFunction={setCreateAccountFunction}
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                    passwordResetSuccess={passwordResetSuccess}
                    setPasswordResetSuccess={setPasswordResetSuccess}
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
                  recoveryEmail={recoveryEmail}
                  setRecoveryEmail={setRecoveryEmail}
                  recoverPassword={recoverPassword}
                  setForgotPassword={setForgotPassword}
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
                  actionCode={actionCode}
                  // continueUrl={continueUrl}
                  resetThePassword={resetThePassword}
                  signOut={signOut}
                  setPasswordResetSuccess={setPasswordResetSuccess}
                />
              )}

              {createAccount && (
                <CreateAccount
                  setCreateAccountFunction={setCreateAccountFunction}
                  setForgotPassword={setForgotPassword}
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
                />
              )}

              {sentEmailVerification && <EmailVerification signOut={signOut} />}
            </Column>
          </Grid>

          {/* <Text>You must be signed in to access this service zzzzz.</Text>
          <SignInFormOld uiConfig={uiConfig} /> */}
        </MainPanel>
      </Layout>
    </>
  );
};

SignInPage.propTypes = {
  me: CustomPropTypes.me,
  signIn: PropTypes.func,
  signOut: PropTypes.func,
  isSigningIn: PropTypes.bool,
  sentEmailVerification: PropTypes.bool,
  location: PropTypes.shape({ search: PropTypes.string }),
};

export default withMe(SignInPage);
