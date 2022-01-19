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

const SignInPage = ({ me, sentEmailVerification, isSigningIn, signOut }) => {
  const uiConfig = {
    signInFlow: "popup",
    signInOptions: providers,
    credentialHelper,
    callbacks: {
      signInSuccessWithAuthResult: () => false,
    },
  };

  const [createAccount, setCreateAccount] = useState(false);

  const [recoverPassword, setRecoverPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");

  const setRecoverPasswordFunction = (boolVal) => {
    setRecoverPassword(boolVal);
  };

  console.log(`recoverPassword:`, recoverPassword);

  const handleSignOut = () => {
    signOut();
  };

  // useEffect(() => {}, [recoverPassword]);

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
              {!recoverPassword && (
                <SignInForm
                  recoverPassword={recoverPassword}
                  setRecoverPassword={setRecoverPasswordFunction}
                />
              )}
              <RecoverPassword
                recoveryEmail={recoveryEmail}
                setRecoveryEmail={setRecoveryEmail}
                recoverPassword={recoverPassword}
                setRecoverPassword={setRecoverPasswordFunction}
                recoveryEmailSent={false}
              />
              {createAccount && <CreateAccount />}
            </Column>
          </Grid>

          {/* <Text>You must be signed in to access this service zzzzz.</Text> */}
          {/* <SignInFormOld uiConfig={uiConfig} /> */}
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
