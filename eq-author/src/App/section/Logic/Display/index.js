import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";

import { useQuery } from "@apollo/react-hooks";

import GET_SECTION from "graphql/getSection.graphql";
import DisplayPage from "./DisplayPage";
import Logic from "..";

import Loading from "components/Loading";
import Error from "components/Error";

const DisplayLogicPage = ({ match }) => {
  const { sectionId } = match.params;

  const { loading, error, data } = useQuery(GET_SECTION, {
    variables: {
      input: { sectionId },
    },
  });

  if (loading) {
    return <Loading height="20em">Loading display</Loading>;
  }

  if (error || !data) {
    return <Error>Something went wrong</Error>;
  }

  const { section } = data;

  return (
    <Logic section={section}>
      <DisplayPage section={section} />
    </Logic>
  );
};

DisplayLogicPage.propTypes = {
  data: PropTypes.shape({
    section: CustomPropTypes.section,
  }),
  loading: PropTypes.bool,
  error: PropTypes.object, // eslint-disable-line
  match: PropTypes.shape({
    params: PropTypes.shape({
      questionnaireId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default DisplayLogicPage;
