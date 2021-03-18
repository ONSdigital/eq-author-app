import React from "react";
import { Route } from "react-router-dom";
import { Query } from "react-apollo";
import GeneralSettingsPage from "./GeneralSettingsPage";
import ThemesPage from "./ThemesPage";
import Error from "components/Error";

import getQuestionnaireQuery from "graphql/getQuestionnaire.graphql";

export default [
  <Route
    key="settings"
    exact
    path="/q/:questionnaireId/settings"
    render={(props) => (
      <Query
        query={getQuestionnaireQuery}
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
        query={getQuestionnaireQuery}
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
            return <ThemesPage {...props} questionnaire={questionnaire} />;
          }
        }}
      </Query>
    )}
  />,
];
