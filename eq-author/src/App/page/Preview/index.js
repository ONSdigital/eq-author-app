/* eslint-disable react/no-danger */
import PropTypes from "prop-types";
import React from "react";
import { withApollo, Query } from "react-apollo";
import gql from "graphql-tag";
import { propType } from "graphql-anywhere";

import Loading from "components/Loading";
import EditorLayout from "components/EditorLayout";

import QuestionPageEditor from "App/page/Design/QuestionPageEditor";
import CalculatedSummaryPageEditor from "App/page/Design/CalculatedSummaryPageEditor";
import ListCollectorPageEditor from "App/page/Design/ListCollectorPageEditor";
import QuestionPagePreview from "./QuestionPagePreview";
import CalculatedSummaryPreview from "./CalculatedSummaryPreview";

import ListCollectorPagePreview from "./ListCollectorPagePreview";

import Panel from "components/Panel";

export const UnwrappedPreviewPageRoute = (props) => {
  const { loading, data } = props;

  if (loading) {
    return (
      <EditorLayout>
        <Panel>
          <Loading height="38rem">Preview loading…</Loading>
        </Panel>
      </EditorLayout>
    );
  }

  const { page } = data;

  if (page.pageType === "QuestionPage") {
    return <QuestionPagePreview page={page} />;
  }
  if (page.pageType === "CalculatedSummaryPage") {
    return <CalculatedSummaryPreview page={page} />;
  }
  if (page.pageType === "ListCollectorPage") {
    return <ListCollectorPagePreview page={page} />;
  }
};

UnwrappedPreviewPageRoute.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    questionPage: propType(QuestionPageEditor.fragments.QuestionPage),
  }),
};

export const PAGE_QUERY = gql`
  query GetPage($input: QueryInput!) {
    page(input: $input) {
      ...QuestionPage
      ...CalculatedSummaryPage
      ...ListCollectorPage
    }
  }
  ${QuestionPageEditor.fragments.QuestionPage}
  ${CalculatedSummaryPageEditor.fragments.CalculatedSummaryPage}
  ${ListCollectorPageEditor.fragments.ListCollectorPage}
`;

export default withApollo((props) => (
  <Query
    query={PAGE_QUERY}
    variables={{
      input: {
        pageId: props.match.params.pageId,
        questionnaireId: props.match.params.questionnaireId,
      },
    }}
  >
    {(innerProps) => <UnwrappedPreviewPageRoute {...innerProps} {...props} />}
  </Query>
));
