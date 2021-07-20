import React, { createContext, useState, useEffect, useContext } from "react";
import PropType from "prop-types";
import { Query, withApollo } from "react-apollo";
import { withRouter } from "react-router-dom";
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

  // console.log("setSignInSuccess :>> ", setSignInSuccess);
  console.log("user.emailVerified :>> ", user.emailVerified);
  // console.log("user :>> ", user);

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
    const actionCodeSettings = {
      url: "http://localhost:3000",
      // This must be true.
      handleCodeInApp: true,
      iOS: {
        bundleId: "com.example.ios",
      },
      android: {
        packageName: "com.example.android",
        installApp: true,
        minimumVersion: "12",
      },
      // dynamicLinkDomain: "https://customizeddomain.page.link/naxz",
    };

    auth.onAuthStateChanged((user) => {
      console.log("user :>> ", user);
      if (user !== null && !user.emailVerified) {
        console.log("Inside email NOT verified :>> ");
        auth
          .sendSignInLinkToEmail(user.email, actionCodeSettings)
          .then(() => {
            console.log(
              "It sent!!!!  actionCodeSettings :>> ",
              actionCodeSettings
            );
            // The link was successfully sent. Inform the user.
            // Save the email locally so you don't need to ask the user for it again
            // if they open the link on the same device.
            // window.localStorage.setItem("emailForSignIn", email);
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("sendSignInLinkToEmail errorCode :>> ", errorCode);
            console.log(
              "sendSignInLinkToEmail errorMessage :>> ",
              errorMessage
            );
          });
      }

      // Confirm the link is a sign-in with email link.
      // if (user) {
      //   console.log(
      //     "isSignInWithEmailLink :>> ",
      //     auth.isSignInWithEmailLink(window.location.href)
      //   );

      //   if (auth.isSignInWithEmailLink(window.location.href)) {
      //     console.log("isSignInWithEmailLink INSIDE :>> ");
      //     // Additional state parameters can also be passed via URL.
      //     // This can be used to continue the user's intended action before triggering
      //     // the sign-in operation.
      //     // Get the email if available. This should be available if the user completes
      //     // the flow on the same device where they started it.

      //     // let email = window.localStorage.getItem('emailForSignIn');
      //     let email = user.email;
      //     if (!email) {
      //       // User opened the link on a different device. To prevent session fixation
      //       // attacks, ask the user to provide the associated email again. For example:
      //       email = window.prompt("Please provide your email for confirmation");
      //     } // The client SDK will parse the code from the link for you.
      //     auth
      //       .signInWithEmailLink(email, window.location.href)
      //       .then((result) => {
      //         console.log("result :>> ", result);
      //         // Clear email from storage.
      //         window.localStorage.removeItem("emailForSignIn"); // You can access the new user via result.user // Additional user info profile not available via: // result.additionalUserInfo.profile == null // You can check if the user is new or existing: // result.additionalUserInfo.isNewUser
      //       })
      //       .catch((error) => {
      //         console.log("error :>> ", error);
      //         // Some error occurred, you can inspect the code: error.code
      //         // Common errors could be invalid email and invalid or expired OTPs.
      //       });
      //   }
      // }

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
  }, [firebaseUser, awaitingFirebase, history, client]);
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

export const useMe = () => useContext(MeContext);
