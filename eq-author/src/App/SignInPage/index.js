import React from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import propTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { providers, credentialHelper } from "components/Auth";
import Loading from "components/Loading";

import Panel from "components/Panel";
import Layout from "components/Layout";
import Button from "components/buttons/Button";
import { Grid, Column } from "components/Grid";

import { withMe } from "App/MeContext";

import SignInFormOld from "./SignInFormOld";
import SignInForm from "./SignInForm";

const Text = styled.p`
  margin-top: 0;
`;

const SignInPanel = styled(Panel)`
  margin: 3em auto 0;
  padding: 2em 3em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  button {
    text-transform: initial;
  }
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

  const handleSignOut = () => {
    signOut();
  };

  return (
    <>
      {me && <Redirect to="/" />}

      <Layout title="Author">
        <SignInPanel>
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
              <SignInForm />
            </Column>
          </Grid>

          <Text>You must be signed in to access this service zzzzz.</Text>
          <SignInFormOld uiConfig={uiConfig} />
        </SignInPanel>
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
