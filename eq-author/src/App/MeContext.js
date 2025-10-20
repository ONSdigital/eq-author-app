import React, { createContext, useState, useEffect, useContext } from "react";
import PropType from "prop-types";
import { Query, withApollo } from "react-apollo";
import { withRouter, useLocation } from "react-router-dom";
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

  const signInUrl = config.REACT_APP_SIGN_IN_URL;

  return window
    .fetch(signInUrl, {
      method: "POST",
      headers: { authorization: `Bearer ${user.ra}` },
    })
    .then((res) => {
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
    .catch((e) => {
      setSentryUser(user.ra);
      setSentryTag("Signing in error");
      sendSentryError(e);
      auth.signOut();
    });
};

const signOut = (history, client, searchParams) => {
  if (config.REACT_APP_FULLSTORY_ORG) {
    window.FS.identify(false);
  }
  client.clearStore();
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  history.push({ pathname: "/sign-in", search: searchParams });

  auth.signOut();
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
  const [sentEmailVerification, setSentEmailVerification] = useState(false);

  const GetSearchParams = () => {
    const location = useLocation();
    return location.search;
  };
  const searchParams = GetSearchParams();

  useEffect(() => {
    // be aware that the return from auth.onAuthStateChanged will change on firebase ver 4.0
    // https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#onauthstatechanged
    // This useEffect hook is responsible for handling the authentication state changes in Firebase.
    // It listens for changes in the authentication state using the onAuthStateChanged method.
    // When the authentication state changes, it updates the firebaseUser state and sets awaitingFirebase to false.
    auth.onAuthStateChanged((user) => {
      setFirebaseUser(user);
      setAwaitingFirebase(false);
      // It also sets up a session timeout for the user if they are authenticated.
      // If the user is not authenticated, the session timeout is cleared using clearTimeout.
      let sessionTimeout = null;
      if (user === null || user === undefined) {
        sessionTimeout && clearTimeout(sessionTimeout);
        sessionTimeout = null;
      } else {
        // If the user is authenticated, it retrieves the ID token result and calculates the session duration.
        user.getIdTokenResult().then((idTokenResult) => {
          const authTime = idTokenResult.claims.auth_time * 1000;
          // The session duration is set to 7 days.
          // The format of the session duration calculation is in milliseconds/seconds/minutes/hours/days.
          const sessionDuration = 1000 * 60 * 60 * 24 * 7; // 604,800,000 milliseconds
          const millisecondsUntilExpiration =
            sessionDuration - (Date.now() - authTime);
          // It then sets up a session timeout using setTimeout, which will automatically sign out the user after the session duration expires.
          sessionTimeout = setTimeout(
            () => auth.signOut(),
            millisecondsUntilExpiration
          );
        });
      }
    });
  }, []);

  useEffect(() => {
    if (awaitingFirebase) {
      return;
    }
    if (firebaseUser && firebaseUser.emailVerified) {
      signIn(setSignInSuccess, history, firebaseUser);
      setSentEmailVerification(false);
    } else if (firebaseUser && !firebaseUser.emailVerified) {
      if (!sentEmailVerification) {
        //without actionCodeSettings sent as params here - it will use the custom action URL template settings in firebase consol
        firebaseUser.sendEmailVerification();
        setSentEmailVerification(true);
      }
      setSignInSuccess(false);
      history.push("/sign-in");
    } else {
      signOut(history, client, searchParams);
      setSignInSuccess(false);
      setSentEmailVerification(false);
    }
  }, [
    firebaseUser,
    awaitingFirebase,
    sentEmailVerification,
    history,
    client,
    searchParams,
  ]);

  return (
    <QueryOrFragment query={CURRENT_USER_QUERY}>
      {(innerProps) => {
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
              sentEmailVerification,
              searchParams,
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

export const MeProvider = flowRight(withApollo, withRouter)(ContextProvider);

export const withMe = (Component) => {
  const InnerComponent = (props) => (
    <MeContext.Consumer>
      {({
        me,
        signIn,
        signOut,
        isSigningIn,
        sentEmailVerification,
        searchParams,
      }) => (
        <Component
          {...props}
          me={me}
          signIn={signIn}
          signOut={signOut}
          isSigningIn={isSigningIn}
          sentEmailVerification={sentEmailVerification}
          searchParams={searchParams}
        />
      )}
    </MeContext.Consumer>
  );
  InnerComponent.fragments = Component.fragments;
  return InnerComponent;
};

export const useMe = () => useContext(MeContext);
