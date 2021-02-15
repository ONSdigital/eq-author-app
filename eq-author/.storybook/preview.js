import React from "react";
import { Router, Route } from "react-router-dom";
import { createMemoryHistory } from "history";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

export const decorators = [
  (Story) => (
    <Router history={createMemoryHistory({ initialEntries: ["/"] })}>
      <Route path="/">
        <Story />
      </Route>
    </Router>
  ),
];
