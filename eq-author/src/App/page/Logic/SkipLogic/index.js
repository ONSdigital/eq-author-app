import React from "react";
import { useQuery } from "@apollo/react-hooks";
import PropTypes from "prop-types";

import Loading from "components/Loading";
import Error from "components/Error";

import SkipLogicPage from "./SkipLogicPage";
import Logic from "App/shared/Logic";
import SKIPLOGIC_QUERY from "./fragment.graphql";

export const SkipLogicRoute = ({ match }) => {
  const { loading, data, error } = useQuery(SKIPLOGIC_QUERY, {
    variables: {
      input: {
        id: match.params.confirmationId || match.params.pageId,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  console.log(error);

  const page = data?.skippable;

  return (
    <Logic page={page}>
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

SkipLogicRoute.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      pageId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default SkipLogicRoute;
