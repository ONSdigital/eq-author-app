import React from "react";

import { Route } from "react-router-dom";

import Design from "./Design";
import Preview from "./Preview";
import Routing from "./Routing";

export default [
  <Route
    key="page-design"
    path="/q/:questionnaireId/page/:pageId/design"
    component={Design}
  />,
  <Route
    key="page-preview"
    path="/q/:questionnaireId/page/:pageId/preview"
    component={Preview}
  />,
  <Route
    key="page-routing"
    path="/q/:questionnaireId/page/:pageId/routing"
    component={Routing}
  />,
];
