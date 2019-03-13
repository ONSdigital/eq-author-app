import React from "react";

import { Route } from "react-router-dom";

import Design from "./Design";
import Preview from "./Preview";

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
];
