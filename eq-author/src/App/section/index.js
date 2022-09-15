import React from "react";

import { Route, Redirect } from "react-router-dom";

import Design from "./Design";
import Preview from "./Preview";
import Display from "./Logic/Display";

export default [
  <Route
    key="section-design"
    path="/q/:questionnaireId/section/:sectionId/design"
    component={Design}
  />,
  <Route
    key="section-preview"
    path="/q/:questionnaireId/section/:sectionId/preview"
    component={Preview}
  />,
  <Route
    key="section-logic"
    path="/q/:questionnaireId/section/:sectionId/logic"
  >
    <Redirect to={"display"} />
  </Route>,
  <Route
    key="section-logic-display"
    path="/q/:questionnaireId/section/:sectionId/display"
    component={Display}
  />,
];
