import React from "react";

import { Route } from "react-router-dom";

import Design from "./Design";

export default [
  <Route
    key="folder-design"
    path="/q/:questionnaireId/folder/:folderId/design"
    component={Design}
  />,
];
