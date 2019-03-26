import React from "react";
import { withApollo, Query } from "react-apollo";
import gql from "graphql-tag";
import CustomPropTypes from "custom-prop-types";
import PropTypes from "prop-types";
import { get, flowRight, isFunction, isEmpty } from "lodash";
import { Titled } from "react-titled";

import IconButtonDelete from "components/buttons/IconButtonDelete";

import Button from "components/buttons/Button";
import IconText from "components/IconText";
import DuplicateButton from "components/buttons/DuplicateButton";

import { connect } from "react-redux";
import { raiseToast } from "redux/toast/actions";
import focusOnEntity from "utils/focusOnEntity";
import Loading from "components/Loading";
import Error from "components/Error";
import withEntityEditor from "components/withEntityEditor";

import EditorLayout from "App/questionPage/Design/EditorLayout";
import withPropRenamed from "enhancers/withPropRenamed";

import { propType } from "graphql-anywhere";

import { Label } from "components/Forms";
import VisuallyHidden from "components/VisuallyHidden";
import withCreatePage from "enhancers/withCreatePage";

import withUpdatePage from "./withUpdatePage";
import withMovePage from "./withMovePage";
import withDeletePage from "./withDeletePage";
import withDuplicatePage from "./withDuplicatePage";

import withUpdateAnswer from "./answers/withUpdateAnswer";
import withCreateAnswer from "./answers/withCreateAnswer";
import withDeleteAnswer from "./answers/withDeleteAnswer";
import withCreateOption from "./answers/withCreateOption";
import withUpdateOption from "./answers/withUpdateOption";
import withDeleteOption from "./answers/withDeleteOption";
import withCreateExclusive from "./answers/withCreateExclusive";
import AliasEditor from "components/AliasEditor";
import { Toolbar, Buttons } from "./EditorToolbar";
import IconMove from "./EditorToolbar/icon-move.svg?inline";
import QuestionPageEditor from "./QuestionPageEditor";

export class UnwrappedQuestionPageRoute extends React.Component {
  static propTypes = {
    match: CustomPropTypes.match,
    onAddAnswer: PropTypes.func.isRequired,
    onDeletePage: PropTypes.func.isRequired,
    onAddPage: PropTypes.func.isRequired,
    onMovePage: PropTypes.func.isRequired,
    onDuplicatePage: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
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

  handleOpenMovePageDialog = () => {
    this.setState({ showMovePageDialog: true });
  };

  handleCloseMovePageDialog = cb => {
    this.setState({ showMovePageDialog: false }, isFunction(cb) ? cb : null);
  };

  handleMovePage = args => {
    this.handleCloseMovePageDialog(() => this.props.onMovePage(args));
  };

  handleOpenDeleteConfirmDialog = () =>
    this.setState({ showDeleteConfirmDialog: true });

  handleCloseDeleteConfirmDialog = cb =>
    this.setState(
      { showDeleteConfirmDialog: false },
      isFunction(cb) ? cb : null
    );

  handleDeletePageConfirm = () => {
    const { onDeletePage, page } = this.props;
    this.handleCloseDeleteConfirmDialog(() => onDeletePage(page));
  };

  handleAddPage = () => {
    const {
      match: { params },
      page,
    } = this.props;

    this.props.onAddPage(params.sectionId, page.position + 1);
  };

  handleAddAnswer = answerType => {
    const { match, onAddAnswer } = this.props;

    return onAddAnswer(match.params.pageId, answerType).then(focusOnEntity);
  };

  handleDuplicatePage = e => {
    e.preventDefault();
    const { match, onDuplicatePage, page } = this.props;
    onDuplicatePage({
      sectionId: match.params.sectionId,
      pageId: page.id,
      position: page.position + 1,
    });
  };

  getPageTitle = page => title => {
    const pageTitle = page.displayName;
    return `${pageTitle} - ${title}`;
  };

  renderContent = () => {
    const { loading, error, page, onChange, onUpdate } = this.props;

    if (loading) {
      return <Loading height="38rem">Page loading…</Loading>;
    }

    if (error || isEmpty(page)) {
      return <Error>Something went wrong</Error>;
    }

    const { showMovePageDialog, showDeleteConfirmDialog } = this.state;
    return (
      <Titled title={this.getPageTitle(page)}>
        <Toolbar>
          <VisuallyHidden>
            <Label htmlFor="alias">Question short code (optional)</Label>
          </VisuallyHidden>
          <AliasEditor
            alias={page.alias}
            onUpdate={onUpdate}
            onChange={onChange}
          />
          <Buttons>
            <Button
              onClick={this.handleOpenMovePageDialog}
              data-test="btn-move"
              variant="tertiary"
              small
            >
              <IconText icon={IconMove}>Move</IconText>
            </Button>
            <DuplicateButton
              onClick={this.handleDuplicatePage}
              data-test="btn-duplicate-page"
            >
              Duplicate
            </DuplicateButton>
            <IconButtonDelete
              onClick={this.handleOpenDeleteConfirmDialog}
              data-test="btn-delete"
            >
              Delete
            </IconButtonDelete>
          </Buttons>
        </Toolbar>
        <QuestionPageEditor
          key={page.id} // this is needed to reset the state of the RichTextEditors when moving between pages
          {...this.props}
          showMovePageDialog={showMovePageDialog}
          onCloseMovePageDialog={this.handleCloseMovePageDialog}
          onMovePage={this.handleMovePage}
          showDeleteConfirmDialog={showDeleteConfirmDialog}
          onCloseDeleteConfirmDialog={this.handleCloseDeleteConfirmDialog}
          onDeletePageConfirm={this.handleDeletePageConfirm}
          onAddPage={this.handleAddPage}
          onAddAnswer={this.handleAddAnswer}
        />
      </Titled>
    );
  };

  render() {
    return (
      <EditorLayout
        onAddPage={this.handleAddPage}
        page={this.props.page}
        preview
        routing
      >
        {this.renderContent()}
      </EditorLayout>
    );
  }
}

const withQuestionPageEditing = flowRight(
  connect(
    null,
    { raiseToast }
  ),
  withApollo,
  withMovePage,
  withCreatePage,
  withUpdatePage,
  withDeletePage,
  withDuplicatePage,
  withUpdateAnswer,
  withCreateAnswer,
  withDeleteAnswer,
  withCreateOption,
  withCreateExclusive,
  withUpdateOption,
  withDeleteOption,
  withPropRenamed("onUpdatePage", "onUpdate"),
  withEntityEditor("page")
);

const WrappedQuestionPageRoute = withQuestionPageEditing(
  UnwrappedQuestionPageRoute
);

export const QUESTION_PAGE_QUERY = gql`
  query GetQuestionPage($input: QueryInput!) {
    page(input: $input) {
      ...QuestionPage
    }
  }

  ${QuestionPageEditor.fragments.QuestionPage}
`;

const QuestionPageRoute = props => (
  <Query
    query={QUESTION_PAGE_QUERY}
    fetchPolicy="cache-and-network"
    variables={{
      input: {
        questionnaireId: props.match.params.questionnaireId,
        pageId: props.match.params.pageId,
      },
    }}
  >
    {innerProps => (
      <WrappedQuestionPageRoute
        {...innerProps}
        {...props}
        page={
          isEmpty(get(innerProps, "data.page", {})) ? {} : innerProps.data.page
        }
      />
    )}
  </Query>
);

QuestionPageRoute.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      questionnaireId: PropTypes.string.isRequired,
      pageId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default QuestionPageRoute;
