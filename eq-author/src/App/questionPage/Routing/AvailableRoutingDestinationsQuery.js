import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import LogicalDestination from "graphql/fragments/logical-destination.graphql";
import QuestionPageDestination from "graphql/fragments/question-page-destination.graphql";
import SectionDestination from "graphql/fragments/section-destination.graphql";

const GET_AVAILABLE_ROUTING_DESTINATIONS = gql`
  query GetAvailableRoutingDestinations($input: QueryInput!) {
    questionPage(input: $input) {
      id
      availableRoutingDestinations {
        logicalDestinations {
          ...LogicalDestination
        }
        questionPages {
          ...QuestionPageDestination
        }
        sections {
          ...SectionDestination
        }
      }
    }
  }

  ${LogicalDestination}
  ${QuestionPageDestination}
  ${SectionDestination}
`;

const AvailableRoutingDestinationsQuery = ({ pageId, children }) => (
  <Query
    query={GET_AVAILABLE_ROUTING_DESTINATIONS}
    variables={{ input: { pageId } }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

AvailableRoutingDestinationsQuery.propTypes = {
  pageId: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};

export default AvailableRoutingDestinationsQuery;
