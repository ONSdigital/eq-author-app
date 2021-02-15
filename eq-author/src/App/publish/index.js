import React from "react";
import { Route } from "react-router-dom";
import PublishPage from "./PublishPage";

export default [
  <Route
    key="publish"
    path="/q/:questionnaireId/publish"
    render={(props) => <PublishPage {...props} />}
  />,
];
