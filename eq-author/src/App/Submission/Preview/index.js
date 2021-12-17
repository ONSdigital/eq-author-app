import React from "react";
import { useQuery } from "@apollo/react-hooks";

import { isEmpty } from "lodash/fp";

import SubmissionLayout from "../SubmissionLayout";
import SubmissionPreview from "./SubmissionPreview";
import GET_SUBMISSION_QUERY from "../graphql/getSubmissionQuery.graphql";

import Loading from "components/Loading";
import Error from "components/Error";

// TODO: Use match and a getquestionnairequery to get the questionnaire title
const Preview = ({ match }) => {
  const { loading, error, data } = useQuery(GET_SUBMISSION_QUERY);

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
    <SubmissionLayout>
      <SubmissionPreview submission={submission} />
    </SubmissionLayout>
  );
};

export default Preview;
