import React from "react";
import { Query } from "react-apollo";
import query from "graphql/getQuestionnaire.graphql";
import PropTypes from "prop-types";

const MoveSectionQuery = ({ questionnaireId, children }) => (
  <Query
    query={query}
    partialRefetch
    variables={{
      input: {
        questionnaireId,
      },
    }}
  >
    {({ loading, data }) => children({ loading, data })}
  </Query>
);

MoveSectionQuery.propTypes = {
  questionnaireId: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};

export default MoveSectionQuery;
