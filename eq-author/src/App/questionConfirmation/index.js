import React from "react";

import { Route, Redirect } from "react-router-dom";
import SkipLogic from "App/shared/Logic/SkipLogic";

import Design from "./Design";
import Preview from "./Preview";
import Routing from "./Logic/Routing";

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
  <Route
    key="confirmation-logic"
    path="/q/:questionnaireId/question-confirmation/:confirmationId/logic"
  >
    <Redirect to="routing" />
  </Route>,
  <Route
    key="confirmation-logic-routing"
    path="/q/:questionnaireId/question-confirmation/:confirmationId/routing"
    component={Routing}
  />,
  <Route
    key="confirmation-logic-skip"
    path="/q/:questionnaireId/question-confirmation/:confirmationId/skip"
    component={SkipLogic}
  />,
];
