import React from "react";
import PropTypes from "prop-types";
import { useQuery } from "@apollo/react-hooks";
import { isEmpty } from "lodash/fp";
import { propType } from "graphql-anywhere";

import Loading from "components/Loading";
import Error from "components/Error";

import IntroductionLayout from "../IntroductionLayout";

import IntroductionEditor from "./IntroductionEditor";
import GET_INTRODUCTION_QUERY from "graphql/getQuestionnaireIntroduction.graphql";

export const IntroductionDesign = () => {
  const { loading, error, data } = useQuery(GET_INTRODUCTION_QUERY);

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

IntroductionDesign.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object, // eslint-disable-line
  data: PropTypes.shape({
    introduction: propType(...IntroductionEditor.fragments),
  }),
};

export default IntroductionDesign;

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
//   IntroductionEditor.fragments
// );

// const IntroductionDesignWithData = (props) => (
//   <Query
//     query={INTRODUCTION_QUERY}
//     variables={{
//       id: props.match.params.introductionId,
//     }}
//   >
//     {(queryProps) => <IntroductionDesign {...props} {...queryProps} />}
//   </Query>
// );
// IntroductionDesignWithData.propTypes = {
//   match: PropTypes.shape({
//     params: PropTypes.shape({
//       introductionId: PropTypes.string.isRequired,
//     }).isRequired,
//   }).isRequired,
// };

// export default IntroductionDesignWithData;
