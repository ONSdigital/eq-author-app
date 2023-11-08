import React from "react";

import { Route, Redirect } from "react-router-dom";
import { Query } from "react-apollo";
import SkipLogic from "App/shared/Logic/SkipLogic";

import Design from "./Design";
import RoutingPage from "./Routing";

import Error from "components/Error";

import GET_FOLDER_QUERY from "./graphql/getFolderQuery.graphql";

export default [
  <Route
    key="folder-design"
    path="/q/:questionnaireId/folder/:folderId/design"
    component={Design}
  />,
  <Route key="folder-logic" path="/q/:questionnaireId/folder/:folderId/logic">
    <Redirect to="routing" />
  </Route>,
  <Route
    key="folder-logic-routing"
    path="/q/:questionnaireId/folder/:folderId/routing"
    render={(props) => (
      <Query
        query={GET_FOLDER_QUERY}
        variables={{
          input: { folderId: props.match.params.folderId },
        }}
      >
        {({ loading, error, data }) => {
          if (loading) {
            return <React.Fragment />;
          }

          if (error) {
            return <Error>Error fetching folder</Error>;
          }

          if (data) {
            const { folder } = data;
            return folder.listId ? (
              <Redirect to="design" />
            ) : (
              <RoutingPage {...props} />
            );
          }
        }}
      </Query>
    )}
  />,
  <Route
    key="folder-logic-skip"
    path="/q/:questionnaireId/folder/:folderId/skip"
    render={(props) => (
      <Query
        query={GET_FOLDER_QUERY}
        variables={{
          input: { folderId: props.match.params.folderId },
        }}
      >
        {({ loading, error, data }) => {
          if (loading) {
            return <React.Fragment />;
          }

          if (error) {
            return <Error>Error fetching folder</Error>;
          }

          if (data) {
            const { folder } = data;
            return folder.listId ? (
              <Redirect to="design" />
            ) : (
              <SkipLogic {...props} />
            );
          }
        }}
      </Query>
    )}
  />,
];
