import React from "react";
import { Route } from "react-router-dom";
import { Query } from "react-apollo";
import SettingsPage from "./SettingsPage";

import getQuestionnaireQuery from "graphql/getQuestionnaire.graphql";

export default [
  <Route
    key="settings"
    path="/q/:questionnaireId/settings"
    render={props => (
      <Query
        query={getQuestionnaireQuery}
        variables={{
          input: { questionnaireId: props.match.params.questionnaireId },
        }}
      >
        {({ loading, error, data, refetch }) => {
          if (loading) {
            return <React.Fragment />;
          }

          if (error) {
            return <p>Error.</p>;
          }

          if (data && refetch) {
            return (
              <SettingsPage
                {...props}
                questionnaire={{ data: data.questionnaire, refetch }}
              />
            );
          }
        }}
      </Query>
    )}
  />,
];
