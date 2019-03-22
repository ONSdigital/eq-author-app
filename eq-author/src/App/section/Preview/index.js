import { propType } from "graphql-anywhere";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import React from "react";
import { Redirect } from "react-router-dom";
import { withApollo, Query } from "react-apollo";

import EditorLayout from "App/questionPage/Design/EditorLayout";
import Loading from "components/Loading";
import SectionEditor from "App/section/Design/SectionEditor";

import { buildSectionPath } from "utils/UrlUtils";

import SectionIntroPreview from "./SectionIntroPreview";

export const UnwrappedPreviewSectionRoute = ({ match, data, loading }) => {
  if (loading || !data) {
    return <Loading height="38rem">Preview loading…</Loading>;
  }

  const { section } = data;

  const hasIntroductionContent =
    section.introductionTitle || section.introductionContent;

  if (!hasIntroductionContent) {
    return (
      <Redirect to={buildSectionPath({ ...match.params, tab: "design" })} />
    );
  }

  return (
    <EditorLayout design preview>
      <SectionIntroPreview section={section} />
    </EditorLayout>
  );
};
UnwrappedPreviewSectionRoute.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    section: propType(SectionEditor.fragments.Section),
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      questionnaireId: PropTypes.string.isRequired,
      sectionId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export const SECTION_QUERY = gql`
  query GetSection($input: QueryInput!) {
    section(input: $input) {
      ...Section
    }
  }

  ${SectionEditor.fragments.Section}
`;

export default withApollo(props => (
  <Query
    query={SECTION_QUERY}
    variables={{
      input: {
        sectionId: props.match.params.sectionId,
        questionnaireId: props.match.params.questionnaireId,
      },
    }}
  >
    {innerProps => <UnwrappedPreviewSectionRoute {...innerProps} {...props} />}
  </Query>
));
