import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import propTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { providers, credentialHelper } from "components/Auth";
import Loading from "components/Loading";
import Layout from "components/Layout";
import Button from "components/buttons/Button";
import { Grid, Column } from "components/Grid";

import { withMe } from "App/MeContext";

import SignInFormOld from "./SignInFormOld";
import SignInForm from "./SignInForm";
import RecoverPassword from "./RecoverPassword";
import CreateAccount from "./CreateAccount";

const Text = styled.p`
  margin-top: 0;
`;

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
}) => {
  const uiConfig = {
    signInFlow: "popup",
    signInOptions: providers,
    credentialHelper,
    callbacks: {
      signInSuccessWithAuthResult: () => false,
    },
  };

  // console.log(`me`, me);
  // console.log(`signIn`, signIn);

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

  const handleSignOut = () => {
    signOut();
  };

  // const handleEmail = (e) => {
  //   setEmail(e.target.value);
  //   setSubmitted(false);
  // };

  return (
    <>
      {me && <Redirect to="/" />}

      <Layout title="Author">
        <MainPanel>
          {sentEmailVerification && (
            <>
              <Text>
                Awaiting email verification, please check your inbox and follow
                instructions.
              </Text>
              <Button variant="tertiary" onClick={handleSignOut}>
                Sign in
              </Button>
            </>
          )}

          {isSigningIn && <Loading height="38rem">Logging you in...</Loading>}

          <Grid>
            <Column cols={9}>
              {!recoverPassword && !createAccount && (
                <SignInForm
                  recoverPassword={recoverPassword}
                  setForgotPassword={setForgotPassword}
                  setCreateAccountFunction={setCreateAccountFunction}
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
                />
              )}
              <RecoverPassword
                recoveryEmail={recoveryEmail}
                setRecoveryEmail={setRecoveryEmail}
                recoverPassword={recoverPassword}
                setForgotPassword={setForgotPassword}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
              />
              {createAccount && (
                <CreateAccount
                  setCreateAccountFunction={setCreateAccountFunction}
                  setForgotPassword={setForgotPassword}
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
                />
              )}
            </Column>
          </Grid>

          {/* <Text>You must be signed in to access this service zzzzz.</Text> */}
          <SignInFormOld uiConfig={uiConfig} />
        </MainPanel>
      </Layout>
    </>
  );
};

SignInPage.propTypes = {
  me: CustomPropTypes.me,
  isSigningIn: propTypes.bool,
  sentEmailVerification: propTypes.bool,
  signOut: propTypes.func,
};

export default withMe(SignInPage);
