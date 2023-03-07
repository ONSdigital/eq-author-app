import React from "react";
import { Route, Redirect } from "react-router-dom";
import SampleFileDataPage from "./SampleFileData";
import ONSDatasetPage from "./ONSDataset";
import { buildDataPath } from "utils/UrlUtils";

export default [
  <Route
    key="sample"
    exact
    path="/q/:questionnaireId/data/sample-file-data"
    component={SampleFileDataPage}
  />,
  <Route
    key="dataset"
    exact
    path="/q/:questionnaireId/data/ons-dataset"
    component={ONSDatasetPage}
  />,
  <Route
    key="data"
    exact
    path="/q/:questionnaireId/data"
    render={(props) => (
      <Redirect to={`${buildDataPath(props.match.params)}/sample-file-data`} />
    )}
  />,
];
