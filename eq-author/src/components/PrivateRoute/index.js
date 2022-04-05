import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { Route, Redirect } from "react-router-dom";

import Loading from "components/Loading";
import Layout from "components/Layout";
import Theme from "contexts/themeContext";

import { withMe } from "App/MeContext";

const createRedirect = ({ location }) => ({
  pathname: "/sign-in",
  search: location.search,
  state: {
    returnURL: location.pathname,
  },
});

const PrivateRoute = React.memo(
  ({ component: Component, isSigningIn, me, ...rest }) => {
    let render;

    if (isSigningIn) {
      render = () => (
        <Theme themeName={"ons"}>
          <Layout title="Author">
            <Loading height="38rem">Logging you in...</Loading>
          </Layout>
        </Theme>
      );
    } else if (me) {
      render = (props) => <Component {...props} />;
    } else {
      render = (props) => <Redirect to={createRedirect(props)} />;
    }

    return <Route {...rest} render={render} />;
  }
);

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  isSigningIn: PropTypes.bool,
  me: CustomPropTypes.user,
};

export default withMe(PrivateRoute);
