import React from "react";

import { Route } from "react-router-dom";

import MetadataPage from "./MetadataPage";

export default [
  <Route
    key="metadata"
    path="/q/:questionnaireId/metadata"
    component={MetadataPage}
  />,
];
