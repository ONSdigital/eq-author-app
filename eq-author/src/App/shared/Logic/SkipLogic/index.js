import React from "react";
import { useQuery } from "@apollo/react-hooks";
import PropTypes from "prop-types";

import Loading from "components/Loading";
import Error from "components/Error";

import SkipLogicPage from "./SkipLogicPage";
import Logic from "App/shared/Logic";

import SKIPLOGIC_QUERY from "./fragment.graphql";

export const SkipLogicRoute = ({ match: { params } }) => {
  const { loading, data } = useQuery(SKIPLOGIC_QUERY, {
    variables: {
      input: {
        id: params.confirmationId || params.pageId || params.folderId,
      },
    },
    fetchPolicy: "cache-and-network",
  });

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
      pageId: PropTypes.string,
      confirmationId: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default SkipLogicRoute;
