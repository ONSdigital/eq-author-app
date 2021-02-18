import React from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { get } from "lodash";
import { withRouter } from "react-router-dom";

import ContentPickerSelect from "components/ContentPickerSelect";
import { ANSWER } from "components/ContentPickerSelect/content-types";
import shapeTree from "components/ContentPicker/shapeTree";

const GET_AVAILABLE_ANSWERS = gql`
  query GetAvailableAnswers($input: GetAvailableAnswersInput!) {
    getAvailableAnswers(input: $input) {
      id
      displayName
      properties
      type
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
`;

export const RoutingAnswerContentPicker = ({
  match,
  includeSelf,
  path,
  ...otherProps
}) => {
  const { loading, error, data } = useQuery(GET_AVAILABLE_ANSWERS, {
    variables: {
      input: {
        pageId: match.params.confirmationId || match.params.pageId,
        includeSelf: Boolean(match.params.confirmationId) || includeSelf,
      },
    },
    fetchPolicy: "cache-and-network",
  });
  return (
    <ContentPickerSelect
      name="answerId"
      contentTypes={[ANSWER]}
      answerData={shapeTree(get(data, path))}
      loading={loading}
      error={error}
      {...otherProps}
    />
  );
};

RoutingAnswerContentPicker.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      confirmationId: PropTypes.string,
      pageId: PropTypes.string,
    }),
  }),
  includeSelf: PropTypes.bool,
  path: PropTypes.string.isRequired,
};

export default withRouter(RoutingAnswerContentPicker);
