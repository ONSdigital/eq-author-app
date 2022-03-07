/* eslint-disable react/no-danger */
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { withApollo, Query } from "react-apollo";
import gql from "graphql-tag";
import { propType } from "graphql-anywhere";
import { useMutation } from "@apollo/react-hooks";

import Loading from "components/Loading";
import EditorLayout from "components/EditorLayout";

import QuestionPageEditor from "App/page/Design/QuestionPageEditor";
import CalculatedSummaryPageEditor from "App/page/Design/CalculatedSummaryPageEditor";

import QuestionPagePreview from "./QuestionPagePreview";
import CalculatedSummaryPreview from "./CalculatedSummaryPreview";
import Panel from "components/Panel";

import { useMe } from "App/MeContext";

import UPDATE_COMMENTS_AS_READ from "graphql/updateCommentsAsRead.graphql";

import { useHistory } from "react-router-dom";

export const UnwrappedPreviewPageRoute = (props) => {
  const history = useHistory();
  const { me } = useMe();

  const [updateCommentsAsRead] = useMutation(UPDATE_COMMENTS_AS_READ);

  const { loading, data } = props;
  const pageId = data?.page?.id;

  // https://stackoverflow.com/questions/66404382/how-to-detect-route-changes-using-react-router-in-react
  useEffect(() => {
    const unlisten = history.listen(() => {
      updateCommentsAsRead({
        variables: {
          input: {
            pageId,
            userId: me.id,
          },
        },
      });
    });
    return function cleanup() {
      unlisten();
    };
  });

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
    }
  }
  ${QuestionPageEditor.fragments.QuestionPage}
  ${CalculatedSummaryPageEditor.fragments.CalculatedSummaryPage}
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
