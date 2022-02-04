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
  const [createAccount, setCreateAccount] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");

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
      console.log("mode >>>>>>>>>>>>>>>>>>>>", mode);
      switch (mode) {
        case "resetPassword":
          resetThePassword(true);
          setErrorMessage("");
          break;
        case "recoverEmail":
          console.log("here at recoverEmail");
          setErrorMessage("");
          break;
        case "verifyEmail":
          console.log("here at verifyEmail >>>>>>>>>>>>>>>>>>>>>>>>>>");
          setErrorMessage("");
          auth
            .applyActionCode(actionCode)
            .then((response) => {
              console.log("response", response);
              // Email address has been verified.
              // TODO: Display a confirmation message to the user.
              // You could also provide the user with a link back to the app.
              // TODO: If a continue URL is available, display a button which on
              // click redirects the user back to the app via continueUrl with
              // additional state determined from that URL's parameters.
            })
            .catch((error) => {
              setErrorMessage(error.message);
              // Code is invalid or expired. Ask the user to verify their email again.
            });
          break;
        default:
          setErrorMessage("Invalid mode code returned from link");
      }
    }
  }, [location.search, mode, actionCode]);

  return (
    <>
      {me && <Redirect to="/" />}

      <Layout title="Author">
        <MainPanel>
          <Grid>
            <Column cols={8}>
              {/* setsentEmailVerification(false) when isSigning is set */}
              {isSigningIn && !sentEmailVerification && (
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
                  setVerificationEmail={setVerificationEmail}
                />
              )}
              {sentEmailVerification && (
                <EmailVerification
                  verificationEmail={verificationEmail}
                  signOut={signOut}
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
  signIn: PropTypes.func,
  signOut: PropTypes.func,
  isSigningIn: PropTypes.bool,
  sentEmailVerification: PropTypes.bool,
  location: PropTypes.shape({ search: PropTypes.string }),
};

export default withMe(SignInPage);
