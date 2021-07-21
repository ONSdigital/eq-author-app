import React from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import propTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { providers, credentialHelper } from "components/Auth";
import Loading from "components/Loading";

import Panel from "components/Panel";
import Layout from "components/Layout";

import { withMe } from "App/MeContext";

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
  max-width: 25em;
  button {
    text-transform: initial;
  }
`;

export class SignInPage extends React.Component {
  render() {
    const uiConfig = {
      signInFlow: "popup",
      signInOptions: providers,
      credentialHelper,
      callbacks: {
        signInSuccessWithAuthResult: () => false,
      },
    };
    if (this.props.me) {
      return <Redirect to="/" />;
    }
    if (this.props.sentEmailVerification) {
      return (
        <Layout title="Email verification">
          <Loading height="38rem">
            Awaiting email verification, please check your inbox, follow
            instructions and then refresh this page.
          </Loading>
        </Layout>
      );
    }
    if (this.props.isSigningIn) {
      return (
        <Layout title="Logging in...">
          <Loading height="38rem">Logging you in...</Loading>
        </Layout>
      );
    }
    return (
      <Layout title="Sign in">
        <SignInPanel>
          <Text>You must be signed in to access this service.</Text>
          <SignInForm uiConfig={uiConfig} />
        </SignInPanel>
      </Layout>
    );
  }
}

SignInPage.propTypes = {
  me: CustomPropTypes.me,
  isSigningIn: propTypes.bool,
  sentEmailVerification: propTypes.bool,
};

export default withMe(SignInPage);
