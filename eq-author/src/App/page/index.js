import React from "react";

import { Route } from "react-router-dom";

import Design from "./Design";
import Preview from "./Preview";
import Logic from "./Logic";

export default [
  <Route
    key="page-design"
    path="/q/:questionnaireId/page/:pageId/design/:modifier?"
    component={Design}
  />,
  <Route
    key="page-preview"
    path="/q/:questionnaireId/page/:pageId/preview"
    component={Preview}
  />,
  <Route
    key="page-logic"
    path="/q/:questionnaireId/page/:pageId/logic"
    component={Logic}
  />,
];
