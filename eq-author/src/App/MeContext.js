import React, { createContext, useState } from "react";
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

const createSignIn = (setHasAccessToken, history) => user => {
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
      setHasAccessToken(true);
      history.push(get(history, "location.state.returnURL") || "/");
    })
    .catch(e => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      auth.signOut();
      setSentryUser(user.ra);
      setSentryTag("Signing in error");
      sendSentryError(e);
      throw e;
    });
};

const createSignOut = (setHasAccessToken, { history, client }) => () => {
  if (config.REACT_APP_FULLSTORY_ORG) {
    window.FS.identify(false);
  }
  setHasAccessToken(false);
  client.clearStore();
  auth.signOut();
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
    }
  }
`;

export const MeContext = createContext();

const FragmentWithChildren = ({ children }) => children({});

const ContextProvider = props => {
  const accessToken = localStorage.getItem("accessToken");
  const [hasAccessToken, setHasAccessToken] = useState(Boolean(accessToken));
  const signIn = createSignIn(setHasAccessToken, props.history);
  const signOut = createSignOut(setHasAccessToken, props);
  const QueryOrFragment = hasAccessToken ? Query : FragmentWithChildren;
  return (
    <QueryOrFragment query={CURRENT_USER_QUERY}>
      {innerProps => {
        const me = get(innerProps, "data.me");
        return (
          <MeContext.Provider
            value={{
              me,
              signIn,
              hasAccessToken,
              signOut,
              awaitingUserQuery: innerProps.loading,
            }}
          >
            {props.children}
          </MeContext.Provider>
        );
      }}
    </QueryOrFragment>
  );
};

ContextProvider.propTypes = {
  history: CustomPropTypes.history.isRequired,
  children: PropType.node,
};

export const MeProvider = flowRight(
  withApollo,
  withRouter
)(ContextProvider);

export const withMe = Component => props => (
  <MeContext.Consumer>
    {({ me, signIn, hasAccessToken, awaitingUserQuery, signOut }) => (
      <Component
        {...props}
        me={me}
        signIn={signIn}
        signOut={signOut}
        hasAccessToken={hasAccessToken}
        awaitingUserQuery={awaitingUserQuery}
      />
    )}
  </MeContext.Consumer>
);
