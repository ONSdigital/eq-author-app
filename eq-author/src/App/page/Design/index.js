import React from "react";
import { withApollo, Query } from "react-apollo";
import gql from "graphql-tag";
import CustomPropTypes from "custom-prop-types";
import PropTypes from "prop-types";
import { get, flowRight } from "lodash";
import { Titled } from "react-titled";

import { connect } from "react-redux";
import { raiseToast } from "redux/toast/actions";
import Loading from "components/Loading";
import Error from "components/Error";

import EditorLayout from "./EditorLayout";

import { propType } from "graphql-anywhere";

import withCreateQuestionPage from "enhancers/withCreateQuestionPage";

import withFetchAnswers from "./withFetchAnswers";

import QuestionPageEditor from "./QuestionPageEditor";

const availableTabMatrix = {
  QuestionPage: { design: true, preview: true, routing: true },
};

const deriveAvailableTabs = (page, loading) =>
  loading || !page ? {} : availableTabMatrix[page.pageType];

export class UnwrappedPageRoute extends React.Component {
  static propTypes = {
    match: CustomPropTypes.match,
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
  };

  handleAddPage = () => {
    const { page } = this.props;

    this.props.onAddQuestionPage(page.section.id, page.position + 1);
  };

  getPageTitle = page => title => {
    const pageTitle = page.displayName;
    return `${pageTitle} - ${title}`;
  };

  renderContent = () => {
    const { loading, error, page } = this.props;

    if (loading) {
      return <Loading height="38rem">Page loading…</Loading>;
    }

    if (error || !page) {
      return <Error>Something went wrong</Error>;
    }

    return (
      <Titled title={this.getPageTitle(page)}>{this.renderPageType()}</Titled>
    );
  };

  render() {
    const { page, loading } = this.props;
    return (
      <EditorLayout
        onAddQuestionPage={this.handleAddPage}
        page={page}
        {...deriveAvailableTabs(page, loading)}
      >
        {this.renderContent()}
      </EditorLayout>
    );
  }
}

const WrappedPageRoute = flowRight(
  connect(
    null,
    { raiseToast }
  ),
  withApollo,
  withCreateQuestionPage,
  withFetchAnswers
)(UnwrappedPageRoute);

export const PAGE_QUERY = gql`
  query GetPage($input: QueryInput!) {
    page(input: $input) {
      ...QuestionPage
    }
  }
  ${QuestionPageEditor.fragments.QuestionPage}
`;

const PageRoute = props => {
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
      {innerProps => {
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
