import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { get, isEmpty } from "lodash/fp";
import { propType } from "graphql-anywhere";

import Loading from "components/Loading";
import Error from "components/Error";

import transformNestedFragments from "utils/transformNestedFragments";

import SubmissionLayout from "../SubmissionLayout";

import SubmissionEditor from "./SubmissionEditor";

export const SubmissionDesign = () => {
  //   if (loading) {
  //     return (
  //       <SubmissionLayout>
  //         <Loading height="38rem">Page loading…</Loading>
  //       </SubmissionLayout>
  //     );
  //   }

  //   const submission = get("questionnaireSubmission", data);
  //   if (error || isEmpty(submission)) {
  //     return <Error>Something went wrong</Error>;
  //   }

  return (
    <SubmissionLayout>
      <SubmissionEditor />
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
