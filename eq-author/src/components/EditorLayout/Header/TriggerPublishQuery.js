import React from "react";
import { ApolloConsumer } from "react-apollo";
import PropTypes from "prop-types";
import gql from "graphql-tag";

export const TRIGGER_PUBLISH_QUERY = gql`
  query triggerPublish($input: ID!) {
    triggerPublish(questionnaireId: $input) {
      id
      launchUrl
    }
  }
`;

const TriggerPublishQuery = ({ children }) => {
  const triggerPublish = client => questionnaireId =>
    client.query({
      query: TRIGGER_PUBLISH_QUERY,
      variables: { input: questionnaireId },
      fetchPolicy: "no-cache",
    });
  return (
    <ApolloConsumer>
      {client => children({ triggerPublish: triggerPublish(client) })}
    </ApolloConsumer>
  );
};

TriggerPublishQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default TriggerPublishQuery;
