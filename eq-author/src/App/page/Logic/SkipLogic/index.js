import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import PropTypes from "prop-types";

import Loading from "components/Loading";
import Error from "components/Error";

import SkipLogicPage from "./SkipLogicPage";
import transformNestedFragments from "utils/transformNestedFragments";
import Logic from "App/shared/Logic";

export const SkipLogicRoute = ({ match }) => {
  const { loading, data } = useQuery(SKIPLOGIC_QUERY, {
    variables: {
      input: match.params,
    },
  });

  const page = data?.page;

  return (
    <Logic>
      {page ? (
        <SkipLogicPage page={page} />
      ) : loading ? (
        <Loading height="20em"> Loading skip logic </Loading>
      ) : (
        <Error> Something went wrong </Error>
      )}
    </Logic>
  );
};

const SKIPLOGIC_QUERY = transformNestedFragments(
  gql`
    query GetSkipLogic($input: QueryInput!) {
      page(input: $input) {
        ...SkipLogicPage
      }
    }
  `,
  SkipLogicPage.fragments
);

SkipLogicRoute.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      pageId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default SkipLogicRoute;
