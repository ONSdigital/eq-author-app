import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { Route, Redirect } from "react-router";

import Loading from "components/Loading";
import Layout from "components/Layout";

import { withMe } from "App/MeContext";

const createRedirect = ({ location }) => ({
  pathname: "/sign-in",
  state: {
    returnURL: location.pathname,
  },
});

const PrivateRoute = React.memo(
  ({
    component: Component,
    hasAccessToken,
    awaitingUserQuery,
    me,
    ...rest
  }) => {
    let render;
    if (hasAccessToken && awaitingUserQuery) {
      render = () => (
        <Layout title="Logging in...">
          <Loading height="38rem">Logging you in...</Loading>
        </Layout>
      );
    } else if (me) {
      render = props => <Component {...props} />;
    } else {
      render = props => <Redirect to={createRedirect(props)} />;
    }

    return <Route {...rest} render={render} />;
  }
);

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  hasAccessToken: PropTypes.bool.isRequired,
  awaitingUserQuery: PropTypes.bool,
  me: CustomPropTypes.user,
};

export default withMe(PrivateRoute);
