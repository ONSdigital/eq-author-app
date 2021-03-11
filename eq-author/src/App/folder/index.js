import React from "react";

import { Route, Redirect } from "react-router-dom";
import SkipLogic from "App/shared/Logic/SkipLogic";

import Design from "./Design";
import RoutingPage from "./Routing";

export default [
  <Route
    key="folder-design"
    path="/q/:questionnaireId/folder/:folderId/design"
    component={Design}
  />,
  <Route key="folder-logic" path="/q/:questionnaireId/folder/:folderId/logic">
    <Redirect to="routing" />
  </Route>,
  <Route
    key="folder-logic-routing"
    path="/q/:questionnaireId/folder/:folderId/routing"
    component={RoutingPage}
  />,
  <Route
    key="folder-logic-skip"
    path="/q/:questionnaireId/folder/:folderId/skip"
    component={SkipLogic}
  />,
];
