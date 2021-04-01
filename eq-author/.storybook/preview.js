import React from "react";
import { Router, Route } from "react-router-dom";
import { createMemoryHistory } from "history";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    values: [
      {
        name: "Black",
        value: "#222",
      },
      {
        name: "Grey",
        value: "#333",
      },
      {
        name: "White",
        value: "#FFF",
      },
    ],
  },
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
