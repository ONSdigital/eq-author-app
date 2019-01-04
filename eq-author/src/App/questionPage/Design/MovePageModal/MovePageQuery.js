import React from "react";
import { Query } from "react-apollo";
import query from "graphql/getQuestionnaire.graphql";
import PropTypes from "prop-types";

const MovePageQuery = ({ questionnaireId, children }) => (
  <Query query={query} variables={{ id: questionnaireId }}>
    {({ loading, data }) => children({ loading, data })}
  </Query>
);

MovePageQuery.propTypes = {
  questionnaireId: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired
};

export default MovePageQuery;
