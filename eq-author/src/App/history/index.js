import React from "react";
import { Route } from "react-router-dom";
import HistoryPage from "./HistoryPage";

export default [
  <Route
    key="history"
    path="/q/:questionnaireId/history"
    component={HistoryPage}
  />,
];
