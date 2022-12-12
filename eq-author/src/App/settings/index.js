import React from "react";
import { Route, Redirect } from "react-router-dom";
import { Query } from "react-apollo";
import GeneralSettingsPage from "./GeneralSettingsPage";
import ThemesPage from "./ThemesPage";
import Error from "components/Error";
import GET_GENERAL_SETTINGS_QUERY from "graphql/getGeneralSettings.graphql";
import GET_THEME_SETTINGS_QUERY from "graphql/getThemeSettings.graphql";
import { buildSettingsPath } from "utils/UrlUtils";

export default [
  <Route
    key="general"
    exact
    path="/q/:questionnaireId/settings/general"
    render={(props) => (
      <Query
        query={GET_GENERAL_SETTINGS_QUERY}
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
            return (
              <GeneralSettingsPage {...props} questionnaire={questionnaire} />
            );
          }
        }}
      </Query>
    )}
  />,
  <Route
    key="themes"
    exact
    path="/q/:questionnaireId/settings/themes"
    render={(props) => (
      <Query
        query={GET_THEME_SETTINGS_QUERY}
        variables={{
          input: { questionnaireId: props.match.params.questionnaireId },
        }}
        fetchPolicy="cache-and-network"
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
            return <ThemesPage {...props} questionnaire={questionnaire} />;
          }
        }}
      </Query>
    )}
  />,
  <Route
    key="settings"
    exact
    path="/q/:questionnaireId/settings"
    render={(props) => (
      <Query
        query={GET_GENERAL_SETTINGS_QUERY}
        variables={{
          input: { questionnaireId: props.match.params.questionnaireId },
        }}
      >
        {({ loading, error }) => {
          if (loading) {
            return <React.Fragment />;
          }

          if (error) {
            return <Error>Error fetching questionnaire from database</Error>;
          }

          return (
            <Redirect to={`${buildSettingsPath(props.match.params)}/general`} />
          );
        }}
      </Query>
    )}
  />,
];
