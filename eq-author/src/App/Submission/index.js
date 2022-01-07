import React from "react";

import { Route } from "react-router-dom";

import Design from "./Design";
import Preview from "./Preview";

export default [
  <Route
    key="submission-design"
    path="/q/:questionnaireId/submission/:submissionId/design/:modifier?"
    component={Design}
  />,
  <Route
    key="submission-preview"
    path="/q/:questionnaireId/submission/:submissionId/preview"
    component={Preview}
  />,
];
