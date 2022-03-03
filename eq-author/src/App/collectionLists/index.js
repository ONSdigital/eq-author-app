import React from "react";
import { Route } from "react-router-dom";
import CollectionListsPage from "./collectionListsPage";

export default [
  <Route
    key="collectionLists"
    path="/q/:questionnaireId/collectionLists"
    render={() => <CollectionListsPage />}
  />,
];
