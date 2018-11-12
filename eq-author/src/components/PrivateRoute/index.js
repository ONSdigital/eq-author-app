import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router";

const createRedirect = ({ location }) => ({
  pathname: "/sign-in",
  state: {
    returnURL: location.pathname
  }
});

const PrivateRoute = ({ component: Component, isSignedIn, ...rest }) => {
  const render = props =>
    isSignedIn ? (
      <Component {...props} />
    ) : (
      <Redirect to={createRedirect(props)} />
    );

  return <Route {...rest} render={render} />;
};

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  isSignedIn: PropTypes.bool.isRequired
};

export default PrivateRoute;
