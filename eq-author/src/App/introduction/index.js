import React from "react";

import { Route } from "react-router-dom";

import Design from "./Design";
import Preview from "./Preview";

export default [
  <Route
    key="introduction-design"
    path="/q/:questionnaireId/introduction/:introductionId/design/:modifier?"
    component={Design}
  />,
  <Route
    key="introduction-preview"
    path="/q/:questionnaireId/introduction/:introductionId/preview"
    component={Preview}
  />,
];
