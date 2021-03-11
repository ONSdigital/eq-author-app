import React from "react";
import { Route } from "react-router-dom";
import QcodesPage from "./QcodesPage";

export default [
  <Route
    key="qcodes"
    path="/q/:questionnaireId/qcodes"
    render={() => <QcodesPage />}
  />,
];
