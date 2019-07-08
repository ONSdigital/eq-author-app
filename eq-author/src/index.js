import * as Sentry from "@sentry/browser";
import createHistory from "history/createHashHistory";
import configureStore from "redux/configureStore";
import fragmentMatcher from "apollo/fragmentMatcher";
import createApolloClient from "apollo/createApolloClient";
import createApolloCache from "apollo/createApolloCache";
import createHttpLink from "apollo/createHttpLink";
import createErrorLink from "apollo/createApolloErrorLink";
import { ApolloLink } from "apollo-link";
import { setContext } from "apollo-link-context";
import config from "config";
import getIdForObject from "utils/getIdForObject";
import render from "utils/render";
import getHeaders from "middleware/headers";

import App from "App";

if (config.REACT_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: config.REACT_APP_SENTRY_DSN,
    environment: config.REACT_APP_SENTRY_ENV,
  });
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
          id: args.id,
        });
      },
    },
  },
});

const history = createHistory();

const httpLink = createHttpLink(config.REACT_APP_API_URL);

const headersLink = setContext((_, { headers }) => ({
  headers: getHeaders(headers),
}));

const link = ApolloLink.from([
  createErrorLink(getStore),
  headersLink,
  httpLink,
]);

const client = createApolloClient(link, cache);

store = configureStore(history, client);

const renderApp = render(document.getElementById("root"), {
  store,
  client,
  history,
});

renderApp(App);

if (module.hot) {
  module.hot.accept("App", () => {
    const NextApp = require("App").default;
    renderApp(NextApp);
  });
}
