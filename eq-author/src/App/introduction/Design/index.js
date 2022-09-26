import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { isEmpty } from "lodash/fp";

import Loading from "components/Loading";
import Error from "components/Error";

import IntroductionLayout from "../IntroductionLayout";

import IntroductionEditor from "./IntroductionEditor";
import GET_INTRODUCTION_QUERY from "graphql/getQuestionnaireIntroduction.graphql";

export const IntroductionDesign = () => {
  const { loading, error, data } = useQuery(GET_INTRODUCTION_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  const introduction = data?.introduction;

  if (loading) {
    return (
      <IntroductionLayout>
        <Loading height="38rem">Page loading…</Loading>
      </IntroductionLayout>
    );
  }

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

export default IntroductionDesign;
