import React from "react";
import BaseLayout from "components/BaseLayout";
import styled from "styled-components";
import { get } from "lodash";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import PropTypes from "prop-types";
import Panel from "components/Panel";
import { Titled } from "react-titled";

import { isSignedIn, verifiedAuthStatus } from "redux/auth/reducer";
import { signInUser, verifyAuthStatus } from "redux/auth/actions";

let SignInForm;

/* istanbul ignore next */
if (process.env.REACT_APP_ENABLE_AUTH === "true") {
  SignInForm = require("components/SignInForm").default;
} else {
  SignInForm = require("components/SignInForm/GuestSignInForm").default;
}

const Centered = styled.div`
  margin: 0 auto;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 1.5em;
  margin: 2em 0 1.5em;
`;

const Text = styled.p`
  margin-top: 0;
`;

const SignInPanel = styled(Panel)`
  padding: 2em 3em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export class UnconnectedSignInPage extends React.Component {
  static propTypes = {
    returnURL: PropTypes.string,
    isSignedIn: PropTypes.bool.isRequired,
    verifiedAuthStatus: PropTypes.bool.isRequired,
    verifyAuthStatus: PropTypes.func.isRequired,
    signInUser: PropTypes.func.isRequired
  };

  static defaultProps = {
    returnURL: "/"
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
      <BaseLayout>
        <Titled title={this.renderTitle}>
          <Centered>
            <Title>Sign in</Title>
            <SignInPanel>
              <Text>You must be signed in to access this service.</Text>
              <SignInForm onSignIn={this.handleSignIn} />
            </SignInPanel>
          </Centered>
        </Titled>
      </BaseLayout>
    );
  }
}

export const mapStateToProps = (state, { location }) => ({
  isSignedIn: isSignedIn(state),
  verifiedAuthStatus: verifiedAuthStatus(state),
  returnURL: get(location, "state.returnURL")
});

export default connect(
  mapStateToProps,
  { signInUser, verifyAuthStatus }
)(UnconnectedSignInPage);
