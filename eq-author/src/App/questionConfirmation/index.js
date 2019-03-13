import React from "react";

import { Route } from "react-router-dom";

import Design from "./Design";
import Preview from "./Preview";

export default [
  <Route
    key="confirmation-design"
    path="/q/:questionnaireId/question-confirmation/:confirmationId/design"
    component={Design}
  />,
  <Route
    key="confirmation-preview"
    path="/q/:questionnaireId/question-confirmation/:confirmationId/preview"
    component={Preview}
  />,
];
