import React from "react";
import { Route } from "react-router-dom";
import { Query } from "react-apollo";
import SettingsPage from "./SettingsPage";
import Error from "components/Error";
import GET_SETTINGS_QUERY from "graphql/getSettings.graphql";

export default [
  <Route
    key="settings"
    exact
    path="/q/:questionnaireId/settings"
    render={(props) => (
      <Query
        query={GET_SETTINGS_QUERY}
        variables={{
          input: { questionnaireId: props.match.params.questionnaireId },
        }}
      >
        {({ loading, error, data }) => {
          if (loading) {
            return <React.Fragment />;
          }

          if (error) {
            return <Error>Error fetching questionnaire from database</Error>;
          }

          if (data) {
            const { questionnaire } = data;
            return <SettingsPage {...props} questionnaire={questionnaire} />;
          }
        }}
      </Query>
    )}
  />,
];
