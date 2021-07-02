import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { propType } from "graphql-anywhere";
import { get } from "lodash";
import { Redirect } from "react-router-dom";
import { Query } from "react-apollo";

import { getSectionById } from "utils/questionnaireUtils";

import DisplayPage from "./DisplayPage";
import Logic from "..";

import { useQuestionnaire } from "components/QuestionnaireContext";
import Loading from "components/Loading";
import Error from "components/Error";

const DisplayLogicPage = ({ data, loading, error, match }) => {
  const { sectionId } = match.params;
  const { questionnaire } = useQuestionnaire();

  const section = getSectionById(questionnaire, sectionId);

  if (loading) {
    return <Loading height="20em">Loading display</Loading>;
  }

  if (error || !section) {
    return (
      <Logic>
        <Error>Something went wrong</Error>
      </Logic>
    );
  }

  return (
    <Logic section={section}>
      <DisplayPage section={section} />
    </Logic>
  );
};

DisplayLogicPage.propTypes = {
  data: PropTypes.shape({
    section: CustomPropTypes.section,
    // propType(
    // transformNestedFragments(
    //   DisplayPage.fragments[0],
    //   DisplayPage.fragments.slice(1)
    // )
    // )
  }),
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object, // eslint-disable-line
  match: PropTypes.shape({
    params: PropTypes.shape({
      questionnaireId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default DisplayLogicPage;
