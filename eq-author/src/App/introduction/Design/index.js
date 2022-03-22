import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { get, isEmpty } from "lodash/fp";
import { propType } from "graphql-anywhere";

import Loading from "components/Loading";
import Error from "components/Error";

import transformNestedFragments from "utils/transformNestedFragments";

import IntroductionLayout from "../IntroductionLayout";

import IntroductionEditor from "./IntroductionEditor";

export const IntroductionDesign = ({ loading, error, data }) => {
  if (loading) {
    return (
      <IntroductionLayout>
        <Loading height="38rem">Page loading…</Loading>
      </IntroductionLayout>
    );
  }

  const introduction = get("questionnaireIntroduction", data);
  const comments = introduction?.comments;

  if (error || isEmpty(introduction)) {
    return <Error>Something went wrong</Error>;
  }

  return (
    <IntroductionLayout comments={comments}>
      <IntroductionEditor introduction={introduction} />
    </IntroductionLayout>
  );
};

IntroductionDesign.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object, // eslint-disable-line
  data: PropTypes.shape({
    introduction: propType(...IntroductionEditor.fragments),
  }),
};

const query = gql`
  query GetQuestionnaireIntroduction($id: ID!) {
    questionnaireIntroduction(id: $id) {
      id
      ...IntroductionEditor
    }
  }
`;

const INTRODUCTION_QUERY = transformNestedFragments(
  query,
  IntroductionEditor.fragments
);

const IntroductionDesignWithData = (props) => (
  <Query
    query={INTRODUCTION_QUERY}
    variables={{
      id: props.match.params.introductionId,
    }}
  >
    {(queryProps) => <IntroductionDesign {...props} {...queryProps} />}
  </Query>
);
IntroductionDesignWithData.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      introductionId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default IntroductionDesignWithData;
