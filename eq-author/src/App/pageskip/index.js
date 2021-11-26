import React from "react";
import { Route } from "react-router-dom";
import PageSkipPage from "./PageSkipPage";

export default [
  <Route
    key="pageskip"
    path="/q/:questionnaireId/pageskip"
    // component={ShortcutsPage}
    render={() => <PageSkipPage />}
  />,
];
