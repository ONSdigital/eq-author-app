import React from "react";
import { useQuery } from "@apollo/react-hooks";
import CustomPropTypes from "custom-prop-types";

import { isEmpty } from "lodash/fp";

import SubmissionLayout from "../SubmissionLayout";
import SubmissionPreview from "./SubmissionPreview";
import GET_QUESTIONNAIRE_QUERY from "graphql/getQuestionnaire.graphql";

import CommentsPanel from "App/Comments";
import Loading from "components/Loading";
import Error from "components/Error";

const Preview = ({ match }) => {
  const { questionnaireId } = match.params;
  const { loading, error, data } = useQuery(GET_QUESTIONNAIRE_QUERY, {
    variables: {
      input: { questionnaireId },
    },
  });

  const submission = data?.questionnaire.submission;
  const questionnaireTitle = data?.questionnaire.title;

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
    <SubmissionLayout
      renderPanel={() => (
        <CommentsPanel
          comments={submission.comments}
          componentId={submission.id}
        />
      )}
    >
      <SubmissionPreview
        submission={submission}
        questionnaireTitle={questionnaireTitle}
      />
    </SubmissionLayout>
  );
};

Preview.propTypes = {
  match: CustomPropTypes.match.isRequired,
};

export default Preview;
