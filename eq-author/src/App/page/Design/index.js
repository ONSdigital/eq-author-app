import React from "react";
import { withApollo } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";
import { flowRight } from "lodash";
import gql from "graphql-tag";
import CustomPropTypes from "custom-prop-types";

import { useCreateQuestionPage } from "hooks/useCreateQuestionPage";
import { PageContextProvider } from "components/QuestionnaireContext";

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
      }
    }
  }
  ${CalculatedSummaryPageEditor.fragments.CalculatedSummaryPage}
  ${QuestionPageEditor.fragments.QuestionPage}
`;

export const UnwrappedPageRoute = (props) => {
  const addQuestionPage = useCreateQuestionPage();
  let { error, data: { page = {} } = {} } = useQuery(PAGE_QUERY, {
    variables: {
      input: {
        questionnaireId: props.match.params.questionnaireId,
        pageId: props.match.params.pageId,
      },
    },
    fetchPolicy: "cache-and-network",
  });
  return (
    <PageContextProvider value={page}>
      <EditorLayout
        title={page?.displayName || ""}
        onAddQuestionPage={() =>
          addQuestionPage({
            folderId: page.folder.id,
            position: page.position + 1,
          })
        }
        renderPanel={() =>
          page.pageType === QuestionPage && <PropertiesPanel page={page} />
        }
        validationErrorInfo={page?.validationErrorInfo}
        {...(availableTabMatrix[page?.pageType] || {})}
      >
        <Panel>
          {error && <Error>Something went wrong</Error>}
          {!error && page.pageType === QuestionPage && (
            <QuestionPageEditor
              key={page.id} // resets the state of the RichTextEditors when navigating pages
              {...props}
              page={page}
            />
          )}
          {!error && page.pageType === CalculatedSummaryPage && (
            <CalculatedSummaryPageEditor
              key={page.id} // resets the state of the RichTextEditors when navigating pages
              {...props}
              page={page}
            />
          )}
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
