import React from "react";
import { Route } from "react-router-dom";
import ReviewPage from "./ReviewPage";

export default [
  <Route
    key="review"
    path="/q/:questionnaireId/review"
    component={ReviewPage}
  />,
];
