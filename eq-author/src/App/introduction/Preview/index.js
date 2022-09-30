/*  eslint-disable react/no-danger */
import React from "react";
import { useQuery } from "@apollo/react-hooks";
import PropTypes from "prop-types";
import { isEmpty } from "lodash/fp";

import CommentsPanel from "App/Comments";

import Loading from "components/Loading";
import Error from "components/Error";

import IntroductionPreview from "./IntroductionPreview";
import IntroductionLayout from "../IntroductionLayout";

import GET_INTRODUCTION_QUERY from "graphql/getQuestionnaireIntroduction.graphql";

const Preview = (props) => {
  const { loading, error, data } = useQuery(GET_INTRODUCTION_QUERY);

  const introduction = data?.introduction;

  if (loading) {
    return (
      <IntroductionLayout>
        <Loading height="38rem">Page loading…</Loading>
      </IntroductionLayout>
    );
  }

  const comments = introduction.comments;

  if (error || isEmpty(introduction)) {
    return <Error>Something went wrong</Error>;
  }

  return (
    <IntroductionLayout
      renderPanel={() => (
        <CommentsPanel comments={comments} componentId={introduction.id} />
      )}
      comments={comments}
    >
      <IntroductionPreview introduction={introduction} {...props} />
    </IntroductionLayout>
  );
};

Preview.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      introductionId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Preview;
