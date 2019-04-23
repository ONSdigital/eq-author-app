import React from "react";

import { Route } from "react-router-dom";

import Design from "./Design";
import Preview from "./Preview";

export default [
  <Route
    key="page-design"
    path="/q/:questionnaireId/introduction/:introductionId/design"
    component={Design}
  />,
  <Route
    key="page-design"
    path="/q/:questionnaireId/introduction/:introductionId/preview"
    component={Preview}
  />,
];
