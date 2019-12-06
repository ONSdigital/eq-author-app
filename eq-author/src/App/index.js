/* eslint-disable react/jsx-no-bind */

import React from "react";
import CustomPropTypes from "custom-prop-types";
import { AppContainer } from "react-hot-loader";
import { Switch, Route, Router } from "react-router-dom";
import { ApolloProvider } from "react-apollo";
import { Provider } from "react-redux";

import PrivateRoute from "components/PrivateRoute";
import RedirectRoute from "components/RedirectRoute";
import Toasts from "components/Toasts";
import { Routes as RoutePaths } from "utils/UrlUtils";

import QuestionnairesPage from "./QuestionnairesPage";
import SignInPage from "./SignInPage";
import QuestionnaireDesignPage from "./QuestionnaireDesignPage";
import NotFoundPage from "./NotFoundPage";
import ErrorBoundary from "./ErrorBoundary";
import { MeProvider } from "./MeContext";

export const Routes = ({ ...otherProps }) => {
  return (
    <Router {...otherProps}>
      <MeProvider>
        <ErrorBoundary>
          <Toasts>
            <Switch>
              <Route path={RoutePaths.SIGN_IN} component={SignInPage} exact />
              <PrivateRoute
                path={RoutePaths.HOME}
                component={QuestionnairesPage}
                exact
              />
              <RedirectRoute
                from="/questionnaire/:questionnaireId/design/:sectionId/:pageId"
                to={"/q/:questionnaireId/page/:pageId/design"}
              />
              <RedirectRoute
                from="/questionnaire/:questionnaireId/design/:sectionId"
                to={"/q/:questionnaireId/section/:sectionId/design"}
              />
              <PrivateRoute
                path={RoutePaths.QUESTIONNAIRE}
                exact={false}
                component={QuestionnaireDesignPage}
              />
              <Route path="*" component={NotFoundPage} exact />
            </Switch>
          </Toasts>
        </ErrorBoundary>
      </MeProvider>
    </Router>
  );
};

Routes.propTypes = {
  data: CustomPropTypes.user,
};

const App = ({ store, client, history }) => {
  return (
    <AppContainer>
      <ApolloProvider client={client}>
        <Provider store={store}>
          <Routes history={history} />
        </Provider>
      </ApolloProvider>
    </AppContainer>
  );
};

App.propTypes = {
  client: CustomPropTypes.apolloClient.isRequired,
  store: CustomPropTypes.store.isRequired,
  history: CustomPropTypes.history.isRequired,
};

export default App;
