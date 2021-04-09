import React from "react";
import { withApollo } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";
import { flowRight, isEmpty } from "lodash";
import gql from "graphql-tag";
import CustomPropTypes from "custom-prop-types";

import { PageContextProvider } from "components/QuestionnaireContext";
import { useNavigationCallbacks } from "components/NavigationCallbacks";

import Loading from "components/Loading";
import Error from "components/Error";
import EditorLayout from "components/EditorLayout";
import Panel from "components/Panel";
import PropertiesPanel from "../PropertiesPanel";
import QuestionPageEditor from "./QuestionPageEditor";
import CalculatedSummaryPageEditor from "./CalculatedSummaryPageEditor";

import withFetchAnswers from "./withFetchAnswers";

import { QuestionPage, CalculatedSummaryPage } from "constants/page-types";

const availableTabMatrix = {
  QuestionPage: { design: true, preview: true, logic: true },
  CalculatedSummaryPage: { design: true, preview: true },
};

export const PAGE_QUERY = gql`
  query GetPage($input: QueryInput!) {
    page(input: $input) {
      ...QuestionPage
      ...CalculatedSummaryPage
      folder {
        id
        position
        enabled
      }
    }
  }
  ${CalculatedSummaryPageEditor.fragments.CalculatedSummaryPage}
  ${QuestionPageEditor.fragments.QuestionPage}
`;

export const UnwrappedPageRoute = (props) => {
  const { onAddQuestionPage } = useNavigationCallbacks();
  const { loading, data: { page = {} } = {} } = useQuery(PAGE_QUERY, {
    variables: {
      input: {
        questionnaireId: props.match.params.questionnaireId,
        pageId: props.match.params.pageId,
      },
    },
    fetchPolicy: "cache-and-network",
  });

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
  };

  const renderContent = () => {
    if (!isEmpty(page)) {
      return renderPageType();
    }

    if (loading) {
      return <Loading height="38rem">Page loading…</Loading>;
    }

    return <Error>Something went wrong</Error>;
  };

  return (
    <PageContextProvider value={page}>
      <EditorLayout
        title={page?.displayName || ""}
        onAddQuestionPage={onAddQuestionPage}
        renderPanel={() =>
          page?.pageType === QuestionPage && <PropertiesPanel page={page} />
        }
        validationErrorInfo={page?.validationErrorInfo}
        {...(availableTabMatrix[page?.pageType] || {})}
      >
        <Panel>{renderContent()}</Panel>
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
