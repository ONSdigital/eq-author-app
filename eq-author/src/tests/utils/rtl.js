import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import { render } from "@testing-library/react";
import PropTypes from "prop-types";
import { merge } from "lodash";

import TestProvider from "./TestProvider";
export { default as flushPromises } from "./flushPromises";

const customRender = (
  ui,
  {
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] }),
    mocks = [],
    storeState = {},
    urlParamMatcher = "",
    ...renderOptions
  } = {}
) => {
  const existingNode = document.getElementById("toast");
  if (existingNode) {
    document.body.removeChild(existingNode);
  }

  const toasts = document.createElement("div");
  toasts.setAttribute("id", "toast");

  document.body.appendChild(toasts);

  const store = {
    getState: jest.fn(() =>
      merge(
        {
          toasts: {},
          saving: { apiDownError: false, offline: false },
        },
        storeState
      )
    ),
    subscribe: jest.fn(),
    dispatch: jest.fn(),
  };

  const Provider = ({ children }) => (
    <TestProvider reduxProps={{ store }} apolloProps={{ mocks }}>
      <Router history={history}>
        <Switch>
          <Route path={urlParamMatcher || route}>{children}</Route>
        </Switch>
      </Router>
    </TestProvider>
  );
  Provider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  const queries = render(<Provider>{ui}</Provider>, renderOptions);
  return {
    ...queries,
    rerender: (ui) => queries.rerender(<Provider>{ui}</Provider>),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history,
  };
};

// eslint-disable-next-line import/export
export * from "@testing-library/react";

// override render method
// eslint-disable-next-line import/export
export { customRender as render };
