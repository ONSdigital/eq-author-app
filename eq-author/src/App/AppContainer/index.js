/* eslint-disable react/jsx-no-bind */

import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { AppContainer } from "react-hot-loader";

import { Switch } from "react-router-dom";
import { Route, Router } from "react-router";
import { ApolloProvider } from "react-apollo";
import PrivateRoute from "App/components/PrivateRoute";
import RedirectRoute from "App/components/RedirectRoute";
import { Routes as RoutePaths } from "utils/UrlUtils";

import QuestionnairesPage from "App/QuestionnairesPage";
import SignInPage from "App/SignInPage";
import QuestionnaireDesignPage from "App/QuestionPage/Design/QuestionnaireDesignPage";
import NotFoundPage from "App/NotFoundPage";
import { Provider, connect } from "react-redux";
import { isSignedIn } from "redux/auth/reducer";

export const Routes = ({ isSignedIn, ...otherProps }) => (
  <Router {...otherProps}>
    <Switch>
      <Route path={RoutePaths.SIGN_IN} component={SignInPage} exact />
      <PrivateRoute
        path={RoutePaths.HOME}
        component={QuestionnairesPage}
        isSignedIn={isSignedIn}
        exact
      />
      <RedirectRoute
        from="/questionnaire/:questionnaireId/design/:sectionId/:pageId"
        to={RoutePaths.PAGE}
      />
      <RedirectRoute
        from="/questionnaire/:questionnaireId/design/:sectionId"
        to={RoutePaths.SECTION}
      />
      <PrivateRoute
        path={RoutePaths.QUESTIONNAIRE}
        exact={false}
        component={QuestionnaireDesignPage}
        isSignedIn={isSignedIn}
      />
      <Route path="*" component={NotFoundPage} exact />
    </Switch>
  </Router>
);

Routes.propTypes = {
  isSignedIn: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isSignedIn: isSignedIn(state)
});
const ConnectedRoutes = connect(mapStateToProps)(Routes);

const App = ({ store, client, history }) => {
  return (
    <AppContainer>
      <ApolloProvider client={client}>
        <Provider store={store}>
          <ConnectedRoutes history={history} />
        </Provider>
      </ApolloProvider>
    </AppContainer>
  );
};

App.propTypes = {
  client: CustomPropTypes.apolloClient.isRequired,
  store: CustomPropTypes.store.isRequired,
  history: CustomPropTypes.history.isRequired
};

export default App;
