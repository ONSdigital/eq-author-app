import { propType } from "graphql-anywhere";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import React from "react";
import { Redirect } from "react-router-dom";
import { withApollo, Query } from "react-apollo";
import { isEmpty, get } from "lodash";

import EditorLayout from "components/EditorLayout";
import Loading from "components/Loading";
import SectionEditor from "App/section/Design/SectionEditor";
import CommentsPanel from "App/Comments";

import { buildSectionPath } from "utils/UrlUtils";

import SectionIntroPreview from "./SectionIntroPreview";

export const UnwrappedPreviewSectionRoute = ({ match, data, loading }) => {
  const section = get(data, "section", {});

  if (!isEmpty(section)) {
    const hasIntroductionContent =
      section.introductionTitle || section.introductionContent;

    if (!hasIntroductionContent) {
      return (
        <Redirect to={buildSectionPath({ ...match.params, tab: "design" })} />
      );
    }
  }
  if (loading) {
    return (
      <EditorLayout>
        <Loading height="38rem">Preview loading…</Loading>
      </EditorLayout>
    );
  }
  return (
    <EditorLayout
      design
      preview
      logic
      title={section.displayName}
      renderPanel={() => (
        <CommentsPanel comments={section.comments} componentId={section.id} />
      )}
      validationErrorInfo={section.validationErrorInfo}
      comments={section.comments}
    >
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
      displayName
      ...Section
    }
  }

  ${SectionEditor.fragments.Section}
`;

export default withApollo((props) => (
  <Query
    query={SECTION_QUERY}
    variables={{
      input: {
        sectionId: props.match.params.sectionId,
        questionnaireId: props.match.params.questionnaireId,
      },
    }}
  >
    {(innerProps) => (
      <UnwrappedPreviewSectionRoute {...innerProps} {...props} />
    )}
  </Query>
));
