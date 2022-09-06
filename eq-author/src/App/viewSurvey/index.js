import React from "react";
import { Route } from "react-router-dom";
import ViewSurveyPage from "./ViewSurveyPage";

export default [
  <Route
    key="viewsurvey"
    path="/q/:questionnaireId/view-survey"
    render={() => <ViewSurveyPage />}
  />,
];
