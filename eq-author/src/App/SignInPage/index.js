import React from "react";
import styled from "styled-components";
import { get } from "lodash";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import PropTypes from "prop-types";

import Panel from "components/Panel";
import Layout from "components/Layout";

import { isSignedIn, verifiedAuthStatus } from "redux/auth/reducer";
import { signInUser, verifyAuthStatus } from "redux/auth/actions";

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

export class UnconnectedSignInPage extends React.Component {
  static propTypes = {
    returnURL: PropTypes.string,
    isSignedIn: PropTypes.bool.isRequired,
    verifiedAuthStatus: PropTypes.bool.isRequired,
    verifyAuthStatus: PropTypes.func.isRequired,
    signInUser: PropTypes.func.isRequired,
  };

  static defaultProps = {
    returnURL: "/",
  };

  componentDidMount() {
    const { isSignedIn, verifyAuthStatus } = this.props;

    if (!isSignedIn) {
      this.unsubscribe = verifyAuthStatus();
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  handleSignIn = user => {
    this.props.signInUser(user);
  };

  renderTitle(title) {
    return `Sign In - ${title}`;
  }

  render() {
    const { verifiedAuthStatus, isSignedIn, returnURL } = this.props;

    if (!verifiedAuthStatus) {
      return null;
    }

    if (isSignedIn) {
      return <Redirect to={returnURL} />;
    }

    return (
      <Layout title="Sign in">
        <SignInPanel>
          <Text>You must be signed in to access this service.</Text>
          <SignInForm onSignIn={this.handleSignIn} />
        </SignInPanel>
      </Layout>
    );
  }
}

export const mapStateToProps = (state, { location }) => ({
  isSignedIn: isSignedIn(state),
  verifiedAuthStatus: verifiedAuthStatus(state),
  returnURL: get(location, "state.returnURL"),
});

export default connect(
  mapStateToProps,
  { signInUser, verifyAuthStatus }
)(UnconnectedSignInPage);
