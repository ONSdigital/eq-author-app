import React, { createContext, useState, useEffect, useContext } from "react";
import PropType from "prop-types";
import { Query, withApollo } from "react-apollo";
import { withRouter } from "react-router";
import gql from "graphql-tag";
import { get, flowRight } from "lodash";
import auth from "components/Auth";
import config from "config";
import CustomPropTypes from "custom-prop-types";
import {
  setSentryUser,
  setSentryTag,
  sendSentryError,
} from "../apollo/sentryUtils";

const signIn = (setSignInSuccess, history, user) => {
  localStorage.setItem("accessToken", user.ra);
  localStorage.setItem("refreshToken", user.refreshToken);
  return window
    .fetch("/signIn", {
      method: "POST",
      headers: { authorization: `Bearer ${user.ra}` },
    })
    .then(res => {
      if (!res.ok) {
        throw Error(`Server responded with a ${res.status} code.`);
      }
      history.push(
        get(
          history,
          "location.state.returnURL",
          get(history, "location.pathname", "/")
        )
      );
      setSignInSuccess(true);
    })
    .catch(e => {
      setSentryUser(user.ra);
      setSentryTag("Signing in error");
      sendSentryError(e);
      auth.signOut();
    });
};

const signOut = (history, client) => {
  if (config.REACT_APP_FULLSTORY_ORG) {
    window.FS.identify(false);
  }
  client.clearStore();
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  history.push("/sign-in");
};

export const CURRENT_USER_QUERY = gql`
  query GetMe {
    me {
      id
      displayName
      picture
      email
      admin
    }
  }
`;

export const MeContext = createContext();

const FragmentWithChildren = ({ children }) => children({});

const ContextProvider = ({ history, client, children }) => {
  const [awaitingFirebase, setAwaitingFirebase] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [signInSuccess, setSignInSuccess] = useState(false);
  const loggedInEverywhere = firebaseUser && signInSuccess;
  const QueryOrFragment = loggedInEverywhere ? Query : FragmentWithChildren;

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      setFirebaseUser(user);
      setAwaitingFirebase(false);
    });
  }, []);

  useEffect(() => {
    if (awaitingFirebase) {
      return;
    }
    if (firebaseUser) {
      signIn(setSignInSuccess, history, firebaseUser);
    } else {
      signOut(history, client);
      setSignInSuccess(false);
    }
  }, [firebaseUser, awaitingFirebase]);
  return (
    <QueryOrFragment query={CURRENT_USER_QUERY}>
      {innerProps => {
        const me = get(innerProps, "data.me");
        const isSigningIn =
          awaitingFirebase ||
          (firebaseUser && !signInSuccess) || // firebase done but not us
          (loggedInEverywhere && innerProps.loading); // we are done and awaiting apollo

        return (
          <MeContext.Provider
            value={{
              me,
              signOut: () => {
                auth.signOut();
              },
              awaitingUserQuery: innerProps.loading,
              isSigningIn,
            }}
          >
            {children}
          </MeContext.Provider>
        );
      }}
    </QueryOrFragment>
  );
};

ContextProvider.propTypes = {
  history: CustomPropTypes.history.isRequired,
  client: CustomPropTypes.apolloClient.isRequired,
  children: PropType.node,
};

export const MeProvider = flowRight(
  withApollo,
  withRouter
)(ContextProvider);

export const withMe = Component => {
  const InnerComponent = props => (
    <MeContext.Consumer>
      {({ me, signIn, signOut, isSigningIn }) => (
        <Component
          {...props}
          me={me}
          signIn={signIn}
          signOut={signOut}
          isSigningIn={isSigningIn}
        />
      )}
    </MeContext.Consumer>
  );
  InnerComponent.fragments = Component.fragments;
  return InnerComponent;
};

export const useMe = () => {
  return useContext(MeContext);
};
