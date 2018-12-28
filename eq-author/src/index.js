import createHistory from "history/createHashHistory";
import configureStore from "redux/configureStore";
import Raven from "raven-js";
import fragmentMatcher from "apollo/fragmentMatcher";
import createApolloClient from "apollo/createApolloClient";
import createApolloCache from "apollo/createApolloCache";
import createHttpLink from "apollo/createHttpLink";
import createErrorLink from "apollo/createApolloErrorLink";
import { ApolloLink } from "apollo-link";
import { setContext } from "apollo-link-context";
import config from "config";
import App from "App/AppContainer";
import getIdForObject from "utils/getIdForObject";
import render from "utils/render";
import appendAuthHeader from "utils/appendAuthHeader";

if (config.REACT_APP_USE_SENTRY === "true") {
  Raven.config(
    "https://b72ac0e6b36344fca4698290bf9a191d@sentry.io/233989"
  ).install();
}

let store;

const getStore = () => store;

const cache = createApolloCache({
  addTypename: true,
  dataIdFromObject: getIdForObject,
  fragmentMatcher,
  cacheRedirects: {
    Query: {
      questionnaire: (_, args, { getCacheKey }) => {
        return getCacheKey({
          __typename: "Questionnaire",
          id: args.id
        });
      }
    }
  }
});

const history = createHistory();

const httpLink = createHttpLink(config.REACT_APP_API_URL);

const authLink = setContext((_, { headers }) => appendAuthHeader(headers));

const link = ApolloLink.from([
  createErrorLink(getStore),
  authLink.concat(httpLink)
]);

const client = createApolloClient(link, cache);

store = configureStore(history, client);

if (window.Cypress && config.REACT_APP_FUNCTIONAL_TEST === "true") {
  window.__store__ = store;
}

const renderApp = render(document.getElementById("root"), {
  store,
  client,
  history
});

renderApp(App);

if (module.hot) {
  module.hot.accept("App/AppContainer", () => {
    const NextApp = require("App/AppContainer").default;
    renderApp(NextApp);
  });
}
