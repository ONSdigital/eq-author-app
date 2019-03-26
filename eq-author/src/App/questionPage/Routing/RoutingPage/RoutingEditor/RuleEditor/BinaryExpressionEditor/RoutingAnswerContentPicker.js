import React from "react";
import PropTypes from "prop-types";
import { get } from "lodash";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "react-router-dom";

import CustomPropTypes from "custom-prop-types";

import ContentPickerSelect from "components/ContentPickerSelect";
import { ANSWER } from "components/ContentPickerSelect/content-types";
import shapeTree from "components/ContentPicker/shapeTree";

const GET_AVAILABLE_ROUTING_ANSWERS = gql`
  query GetAvailableRoutingAnswers($input: QueryInput!) {
    page(input: $input) {
      id
      displayName
      availableRoutingAnswers {
        id
        displayName
        page {
          id
          displayName
          section {
            id
            displayName
          }
        }
      }
    }
  }
`;

export const UnwrappedRoutingAnswerContentPicker = ({
  data,
  path,
  ...otherProps
}) => (
  <ContentPickerSelect
    name="answerId"
    contentTypes={[ANSWER]}
    answerData={shapeTree(get(data, path))}
    {...otherProps}
  />
);

UnwrappedRoutingAnswerContentPicker.propTypes = {
  data: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  path: PropTypes.string.isRequired,
};

const RoutingAnswerContentPicker = props => (
  <Query
    query={GET_AVAILABLE_ROUTING_ANSWERS}
    variables={{ input: props.match.params }}
    fetchPolicy="cache-and-network"
  >
    {innerProps => (
      <UnwrappedRoutingAnswerContentPicker {...innerProps} {...props} />
    )}
  </Query>
);

RoutingAnswerContentPicker.propTypes = {
  match: CustomPropTypes.match,
};

export default withRouter(RoutingAnswerContentPicker);
