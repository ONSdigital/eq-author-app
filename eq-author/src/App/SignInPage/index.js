import React, { useState } from "react";
import { withMe } from "App/MeContext";

import styled from "styled-components";
import { Redirect } from "react-router-dom";
import propTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import Layout from "components/Layout";
import { Grid, Column } from "components/Grid";

import SignInForm from "./SignInForm";
import RecoverPassword from "./RecoverPassword";
import CreateAccount from "./CreateAccount";
import EmailVerification from "./EmailVerification";

const MainPanel = styled.div`
  margin: 3em auto 0;
  display: flex;
  flex-direction: column;
`;

const SignInPage = ({
  me,
  signIn,
  signOut,
  isSigningIn,
  sentEmailVerification,
  // todo - do we need this???
  // sentPasswordResetEmail
}) => {
  // const uiConfig = {
  //   signInFlow: "popup",
  //   signInOptions: providers,
  //   credentialHelper,
  //   callbacks: {
  //     signInSuccessWithAuthResult: () => false,
  //   },
  // };

  // console.log(`me`, me);
  // console.log(`signIn`, signIn);
  // console.log("isSigningIn", isSigningIn);
  // console.log("sentEmailVerification", sentEmailVerification);

  const [createAccount, setCreateAccount] = useState(false);
  const [recoverPassword, setRecoverPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const setForgotPassword = (boolVal) => {
    setRecoverPassword(boolVal);
  };
  const setCreateAccountFunction = (boolVal) => {
    setCreateAccount(boolVal);
  };

  // const handleSignOut = () => {
  //   signOut();
  // };

  return (
    <>
      {me && <Redirect to="/" />}

      <Layout title="Author">
        <MainPanel>
          {/* {isSigningIn && <Loading height="38rem">Logging you in...</Loading>} */}

          <Grid>
            <Column cols={9}>
              {!recoverPassword && !createAccount && !sentEmailVerification && (
                <SignInForm
                  recoverPassword={recoverPassword}
                  setForgotPassword={setForgotPassword}
                  setCreateAccountFunction={setCreateAccountFunction}
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
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
  signIn: propTypes.func,
  signOut: propTypes.func,
  isSigningIn: propTypes.bool,
  sentEmailVerification: propTypes.bool,
};

export default withMe(SignInPage);
