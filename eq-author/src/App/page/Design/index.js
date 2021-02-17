import React from "react";
import { withApollo, Query } from "react-apollo";
import gql from "graphql-tag";
import CustomPropTypes from "custom-prop-types";
import PropTypes from "prop-types";
import { get, flowRight, isEmpty } from "lodash";
import { propType } from "graphql-anywhere";

import Loading from "components/Loading";
import Error from "components/Error";
import EditorLayout from "components/EditorLayout";

import Panel from "components/Panel";

import withCreateQuestionPage from "enhancers/withCreateQuestionPage";

import PropertiesPanel from "../PropertiesPanel";

import withFetchAnswers from "./withFetchAnswers";
import QuestionPageEditor from "./QuestionPageEditor";
import CalculatedSummaryPageEditor from "./CalculatedSummaryPageEditor";

import { PageContextProvider } from "components/QuestionnaireContext";

const availableTabMatrix = {
  QuestionPage: { design: true, preview: true, logic: true },
  CalculatedSummaryPage: { design: true, preview: true },
};

const deriveAvailableTabs = (page) =>
  isEmpty(page) ? {} : availableTabMatrix[page.pageType];

export class UnwrappedPageRoute extends React.Component {
  static propTypes = {
    match: CustomPropTypes.match.isRequired,
    onAddQuestionPage: PropTypes.func.isRequired,
    error: PropTypes.object, // eslint-disable-line
    loading: PropTypes.bool.isRequired,
    page: PropTypes.shape({
      questionPage: propType(QuestionPageEditor.fragments.QuestionPage),
    }),
  };

  state = {
    showDeleteConfirmDialog: false,
    showMovePageDialog: false,
    hasError: false,
  };

  renderPageType = () => {
    const { page } = this.props;
    if (page.pageType === "QuestionPage") {
      return (
        <QuestionPageEditor
          key={page.id} // this is needed to reset the state of the RichTextEditors when moving between pages
          {...this.props}
        />
      );
    }
    if (page.pageType === "CalculatedSummaryPage") {
      return (
        <CalculatedSummaryPageEditor
          key={page.id} // this is needed to reset the state of the RichTextEditors when moving between pages
          {...this.props}
        />
      );
    }
  };

  handleAddPage = () => {
    const { page } = this.props;

    this.props.onAddQuestionPage(page.section.id, page.folder.position + 1);
  };

  renderContent = () => {
    const { loading, page } = this.props;

    if (!isEmpty(page)) {
      return this.renderPageType();
    }

    if (loading) {
      return <Loading height="38rem">Page loading…</Loading>;
    }

    return <Error>Something went wrong</Error>;
  };

  render() {
    const { page } = this.props;
    return (
      <PageContextProvider value={page}>
        <EditorLayout
          onAddQuestionPage={this.handleAddPage}
          renderPanel={() =>
            page.pageType === "QuestionPage" && <PropertiesPanel page={page} />
          }
          title={(page || {}).displayName || ""}
          {...deriveAvailableTabs(page)}
          validationErrorInfo={page && page.validationErrorInfo}
        >
          <Panel>{this.renderContent()}</Panel>
        </EditorLayout>
      </PageContextProvider>
    );
  }
}

const WrappedPageRoute = flowRight(
  withApollo,
  withCreateQuestionPage,
  withFetchAnswers
)(UnwrappedPageRoute);

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

const PageRoute = (props) => {
  return (
    <Query
      query={PAGE_QUERY}
      fetchPolicy="cache-and-network"
      variables={{
        input: {
          questionnaireId: props.match.params.questionnaireId,
          pageId: props.match.params.pageId,
        },
      }}
    >
      {(innerProps) => {
        return (
          <WrappedPageRoute
            {...innerProps}
            {...props}
            page={get(innerProps, "data.page", {})}
          />
        );
      }}
    </Query>
  );
};

PageRoute.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      questionnaireId: PropTypes.string.isRequired,
      pageId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default PageRoute;
