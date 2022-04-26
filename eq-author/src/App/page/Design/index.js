import React from "react";
import { withApollo } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";
import { flowRight, isEmpty } from "lodash";
import gql from "graphql-tag";
import CustomPropTypes from "custom-prop-types";

import {
  PageContextProvider,
  useQuestionnaire,
} from "components/QuestionnaireContext";
import { useNavigationCallbacks } from "components/NavigationCallbacks";

import Loading from "components/Loading";
import Error from "components/Error";
import EditorLayout from "components/EditorLayout";
import Panel from "components/Panel";
import QuestionPageEditor from "./QuestionPageEditor";
import CalculatedSummaryPageEditor from "./CalculatedSummaryPageEditor";
import ListCollectorPageEditor from "./ListCollectorPageEditor";

import withFetchAnswers from "./withFetchAnswers";

import {
  QuestionPage,
  CalculatedSummaryPage,
  ListCollectorPage,
} from "constants/page-types";

import RedirectRoute from "components/RedirectRoute";

const availableTabMatrix = {
  QuestionPage: { design: true, preview: true, logic: true },
  CalculatedSummaryPage: { design: true, preview: true, logic: true },
  ListCollectorPage: { design: true, preview: true, logic: true },
};

export const PAGE_QUERY = gql`
  query GetPage($input: QueryInput!) {
    page(input: $input) {
      ...QuestionPage
      ...CalculatedSummaryPage
      ...ListCollectorPage
      folder {
        id
        position
      }
    }
  }
  ${CalculatedSummaryPageEditor.fragments.CalculatedSummaryPage}
  ${QuestionPageEditor.fragments.QuestionPage}
  ${ListCollectorPageEditor.fragments.ListCollectorPage}
`;

export const UnwrappedPageRoute = (props) => {
  const { onAddQuestionPage } = useNavigationCallbacks();
  const {
    error,
    loading,
    data: { page = {} } = {},
  } = useQuery(PAGE_QUERY, {
    variables: {
      input: {
        questionnaireId: props.match.params.questionnaireId,
        pageId: props.match.params.pageId,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  const { questionnaire } = useQuestionnaire();
  const { comments } = page;

  const renderPageType = () => {
    if (page.pageType === QuestionPage) {
      return (
        <QuestionPageEditor
          key={page.id} // resets the state of the RichTextEditors when navigating pages
          {...props}
          page={page}
        />
      );
    }

    if (page.pageType === CalculatedSummaryPage) {
      return (
        <CalculatedSummaryPageEditor
          key={page.id} // resets the state of the RichTextEditors when navigating pages
          {...props}
          page={page}
        />
      );
    }

    if (page.pageType === ListCollectorPage) {
      return (
        <ListCollectorPageEditor
          key={page.id} // resets the state of the RichTextEditors when navigating pages
          {...props}
          page={page}
        />
      );
    }
  };

  const renderContent = () => {
    if (!isEmpty(page)) {
      return renderPageType();
    }

    if (loading) {
      return <Loading height="38rem">Page loading…</Loading>;
    }

    if (error) {
      return <Error>Something went wrong</Error>;
    }
    if (isEmpty(page)) {
      return <Error>Oops! Page could not be found</Error>;
    }
  };

  const redirectPage = () => {
    if (page === null) {
      return (
        <RedirectRoute
          from={"/q/:questionnaireId/page/:pageId/design"}
          to={
            "/q/:questionnaireId/page/" +
            questionnaire?.sections[0]?.folders[0]?.pages[0]?.id +
            "/design"
          }
        />
      );
    }
  };

  return (
    <PageContextProvider value={page}>
      <EditorLayout
        title={page?.displayName || ""}
        onAddQuestionPage={onAddQuestionPage}
        validationErrorInfo={page?.validationErrorInfo}
        comments={comments}
        {...(availableTabMatrix[page?.pageType] || {})}
      >
        <Panel>
          {renderContent()} {redirectPage()}
        </Panel>
      </EditorLayout>
    </PageContextProvider>
  );
};

UnwrappedPageRoute.propTypes = {
  match: CustomPropTypes.match.isRequired,
};

const WrappedPageRoute = flowRight(
  withApollo,
  withFetchAnswers
)(UnwrappedPageRoute);

export default WrappedPageRoute;
