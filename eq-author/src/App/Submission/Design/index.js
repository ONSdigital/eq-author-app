import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { get, isEmpty } from "lodash/fp";
import { propType } from "graphql-anywhere";
import { useMutation, useQuery } from "@apollo/react-hooks";

import Loading from "components/Loading";
import Error from "components/Error";

import transformNestedFragments from "utils/transformNestedFragments";

import GET_SUBMISSION_QUERY from "../graphql/getSubmissionQuery.graphql";

import SubmissionLayout from "../SubmissionLayout";

import SubmissionEditor from "./SubmissionEditor";

export const SubmissionDesign = () => {
  const { loading, error, data } = useQuery(GET_SUBMISSION_QUERY);
  console.log(`data`, data);

  if (loading) {
    return (
      <SubmissionLayout>
        <Loading height="38rem">Page loading…</Loading>
      </SubmissionLayout>
    );
  }

  const submission = data?.submission;
  console.log(`submission`, submission);
  //   if (error || isEmpty(submission)) {
  //     return <Error>Something went wrong</Error>;
  //   }

  return (
    <SubmissionLayout>
      <SubmissionEditor submission={submission} />
    </SubmissionLayout>
  );
};

export default SubmissionDesign;

// SubmissionDesign.propTypes = {
//   loading: PropTypes.bool.isRequired,
//   error: PropTypes.object, // eslint-disable-line
//   data: PropTypes.shape({
//     submission: propType(...SubmissionEditor.fragments),
//   }),
// };

// const query = gql`
//   query GetQuestionnaireIntroduction($id: ID!) {
//     questionnaireIntroduction(id: $id) {
//       id
//       ...IntroductionEditor
//     }
//   }
// `;

// const INTRODUCTION_QUERY = transformNestedFragments(
//   query,
//   SubmissionEditor.fragments
// );

// const SubmissionDesignWithData = (props) => (
//   <Query
//     query={INTRODUCTION_QUERY}
//     variables={{
//       id: props.match.params.submissionId,
//     }}
//   >
//     {(queryProps) => <SubmissionDesign {...props} {...queryProps} />}
//   </Query>
// );
// SubmissionDesignWithData.propTypes = {
//   match: PropTypes.shape({
//     params: PropTypes.shape({
//       submissionId: PropTypes.string.isRequired,
//     }).isRequired,
//   }).isRequired,
// };

// export default SubmissionDesignWithData;
