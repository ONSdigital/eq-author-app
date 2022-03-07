import React from "react";

import { Route, Redirect } from "react-router-dom";

import Design from "./Design";
import Preview from "./Preview";
import Routing from "./Logic/Routing";
import SkipLogic from "App/shared/Logic/SkipLogic";

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
  <Route key="page-logic" path="/q/:questionnaireId/page/:pageId/logic">
    <Redirect to="routing" />
  </Route>,
  <Route
    key="page-logic-routing"
    path="/q/:questionnaireId/page/:pageId/routing"
    component={Routing}
  />,
  <Route
    key="page-logic-skip"
    path="/q/:questionnaireId/page/:pageId/skip"
    component={SkipLogic}
  />,
];
