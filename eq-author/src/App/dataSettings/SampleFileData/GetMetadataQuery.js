import React from "react";
import { Query } from "react-apollo";
import PropTypes from "prop-types";
import gql from "graphql-tag";

import metadataFragment from "graphql/fragments/metadata.graphql";

export const METADATA_QUERY = gql`
  query GetQuestionnaireWithMetadata($input: QueryInput!) {
    questionnaire(input: $input) {
      id
      metadata {
        ...Metadata
      }
    }
  }
  ${metadataFragment}
`;

const GetMetadataQuery = ({ questionnaireId, children }) => (
  <Query query={METADATA_QUERY} variables={{ input: { questionnaireId } }}>
    {({ loading, error, data }) => children({ loading, error, data })}
  </Query>
);

GetMetadataQuery.propTypes = {
  questionnaireId: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};

export default GetMetadataQuery;
