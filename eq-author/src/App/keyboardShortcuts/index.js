import React from "react";
import { Route } from "react-router-dom";
import KeyboardShortcutsPage from "./KeyboardShortcutsPage";

export default [
  <Route
    key="keyboardShortcuts"
    path="/q/:questionnaireId/keyboardShortcuts"
    render={() => <KeyboardShortcutsPage />}
  />,
];
