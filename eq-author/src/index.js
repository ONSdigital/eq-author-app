import createHistory from "history/createHashHistory";
import configureStore from "redux/configureStore";
import Raven from "raven-js";
import fragmentMatcher from "apollo/fragmentMatcher";
import createApolloClient from "apollo/createApolloClient";
import createApolloCache from "apollo/createApolloCache";
import createHttpLink from "apollo/createHttpLink";
import createErrorLink from "apollo/createApolloErrorLink";
import { ApolloLink, split } from "apollo-link";
import { setContext } from "apollo-link-context";
import { getMainDefinition } from "apollo-utilities";
import { WebSocketLink } from "apollo-link-ws";

import config from "config";
import getIdForObject from "utils/getIdForObject";
import render from "utils/render";
import getHeaders from "middleware/headers";

import App from "App";

if (config.REACT_APP_SENTRY_DSN !== "") {
  Raven.config(config.REACT_APP_SENTRY_DSN).install();
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
// eslint-disable-next-line
console.log("CONFIG", config.REACT_APP_API_URL.startsWith("http"));
const httpLink = createHttpLink(config.REACT_APP_API_URL);
let wsUri;
if (config.REACT_APP_API_URL.startsWith("http")) {
  wsUri = config.REACT_APP_API_URL.replace(/http[s]?:\/\//, "ws://");
} else {
  const loc = window.location;
  const protocol = loc.protocol === "https:" ? "wss" : "ws";
  wsUri = `${protocol}://${loc.host}${loc.pathname}graphql`;
}
// eslint-disable-next-line
console.log(wsUri);

const wsLink = new WebSocketLink({
  uri: wsUri,
  options: {
    reconnect: true,
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

const headersLink = setContext((_, { headers }) => ({
  headers: getHeaders(headers),
}));

const link = ApolloLink.from([
  createErrorLink(getStore),
  headersLink,
  networkLink,
]);

const client = createApolloClient(link, cache);

store = configureStore(history, client);

if (window.Cypress && config.REACT_APP_FUNCTIONAL_TEST === "true") {
  window.__store__ = store;
}

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
