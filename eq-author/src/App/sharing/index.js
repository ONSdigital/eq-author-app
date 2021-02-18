import React from "react";
import { Route } from "react-router-dom";
import SharePage from "./SharePage.js";

export default [
  <Route
    key="sharing"
    path="/q/:questionnaireId/sharing"
    render={(props) => <SharePage {...props} />}
  />,
];
