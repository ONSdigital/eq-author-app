import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { isEmpty } from "lodash/fp";
import { useQuery } from "@apollo/react-hooks";

import Loading from "components/Loading";
import Error from "components/Error";

import GET_SUBMISSION_QUERY from "../graphql/getSubmissionQuery.graphql";
import SubmissionLayout from "../SubmissionLayout";
import SubmissionEditor from "./SubmissionEditor";

export const SubmissionDesign = ({ match }) => {
  const { questionnaireId } = match.params;
  const { loading, error, data } = useQuery(GET_SUBMISSION_QUERY, {
    variables: {
      input: {
        questionnaireId,
      },
    },
  });

  console.log(`data`, data);

  const submission = data?.submission;

  if (loading) {
    return (
      <SubmissionLayout>
        <Loading height="38rem">Page loading…</Loading>
      </SubmissionLayout>
    );
  }

  if (error || isEmpty(submission)) {
    return <Error>Something went wrong</Error>;
  }

  return (
    <SubmissionLayout data-test="submission-page">
      <SubmissionEditor submission={submission} />
    </SubmissionLayout>
  );
};

SubmissionDesign.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object, // eslint-disable-line
  data: PropTypes.shape({
    submission: PropTypes.shape({
      id: PropTypes.string.isRequired,
      furtherContent: PropTypes.string,
      viewPrintAnswers: PropTypes.bool,
      emailConfirmation: PropTypes.bool,
      feedback: PropTypes.bool,
    }),
  }),
  match: CustomPropTypes.match.isRequired,
};

export default SubmissionDesign;
