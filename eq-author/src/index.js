import * as Sentry from "@sentry/browser";
import { createHashHistory } from "history";
import configureStore from "redux/configureStore";
import fragmentMatcher from "apollo/fragmentMatcher";
import createApolloClient from "apollo/createApolloClient";
import createApolloCache from "apollo/createApolloCache";
import createHttpLink from "apollo/createHttpLink";
import createErrorLink from "apollo/createApolloErrorLink";
import { ApolloLink, split } from "apollo-link";
import { setContext } from "apollo-link-context";
import { getMainDefinition } from "apollo-utilities";
import { WebSocketLink } from "apollo-link-ws";
import TagManager from "react-gtm-module";
import config from "config";
import getIdForObject from "utils/getIdForObject";
import render from "utils/render";
import getHeaders from "middleware/headers";

import App from "App";

if (config.REACT_APP_GTM_ID) {
  const tagManagerArgs = {
    gtmId: config.REACT_APP_GTM_ID,
  };
  if (config.REACT_APP_GTM_AUTH && config.REACT_APP_GTM_PREVIEW) {
    tagManagerArgs.auth = config.REACT_APP_GTM_AUTH;
    tagManagerArgs.preview = config.REACT_APP_GTM_PREVIEW;
  }
  TagManager.initialize(tagManagerArgs);
}

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

const history = createHashHistory();

const httpLink = createHttpLink(config.REACT_APP_API_URL);
let wsUri;
if (config.REACT_APP_API_URL.startsWith("http")) {
  wsUri = config.REACT_APP_API_URL.replace(/http([s])?:\/\//, "ws$1://");
} else {
  const loc = window.location;
  const protocol = loc.protocol === "https:" ? "wss" : "ws";
  wsUri = `${protocol}://${loc.host}${loc.pathname}graphql`;
}

const wsLink = new WebSocketLink({
  uri: wsUri,
  options: {
    reconnect: true,
    connectionParams: () => ({
      headers: getHeaders({}),
    }),
  },
});

const networkLink = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const headersLink = setContext((_, { headers }) =>
  getHeaders(headers).then((headers) => ({
    headers,
  }))
);

const link = ApolloLink.from([
  createErrorLink(getStore),
  headersLink,
  networkLink,
]);

const client = createApolloClient(link, cache);

store = configureStore();

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
