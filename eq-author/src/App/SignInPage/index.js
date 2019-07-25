import React from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { providers, credentialHelper } from "components/Auth";

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
`;

export class SignInPage extends React.Component {
  renderTitle(title) {
    return `Sign In - ${title}`;
  }

  state = {
    incompleteLoginAttempts: 0,
  };

  render() {
    const { incompleteLoginAttempts } = this.state;
    const rerender = () =>
      this.setState({ incompleteLoginAttempts: incompleteLoginAttempts + 1 });
    const uiConfig = {
      signInFlow: "popup",
      signInOptions: providers,
      credentialHelper,
      callbacks: {
        signInSuccessWithAuthResult: ({ user }) => {
          this.props.signIn(user).catch(() => rerender());
          return false;
        },
      },
    };
    if (this.props.me) {
      return <Redirect to="/" />;
    }
    return (
      <Layout title="Sign in">
        <SignInPanel>
          <Text>You must be signed in to access this service.</Text>
          <SignInForm uiConfig={uiConfig} key={incompleteLoginAttempts} />
        </SignInPanel>
      </Layout>
    );
  }
}

SignInPage.propTypes = {
  signIn: PropTypes.func.isRequired,
  me: CustomPropTypes.me,
};

export default withMe(SignInPage);
