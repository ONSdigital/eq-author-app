import React from "react";
import { withApollo, Query } from "react-apollo";
import gql from "graphql-tag";
import CustomPropTypes from "custom-prop-types";
import PropTypes from "prop-types";
import { get, flowRight, isFunction, isEmpty } from "lodash";
import { Titled } from "react-titled";

import QuestionPageEditor from "App/QuestionPage/Design/QuestionPageEditor";
import IconButtonDelete from "components/Buttons/IconButtonDelete";
import { Toolbar, Buttons } from "App/QuestionPage/Design/EditorToolbar";
import IconMove from "App/QuestionPage/Design/EditorToolbar/icon-move.svg?inline";
import Button from "components/Buttons/Button";
import IconText from "components/IconText";
import DuplicateButton from "components/Buttons/DuplicateButton";

import { connect } from "react-redux";
import { raiseToast } from "redux/toast/actions";
import withUpdatePage from "App/QuestionPage/Design/QuestionPageRoute/withUpdatePage";
import withUpdateAnswer from "App/QuestionPage/Design/Answers/withUpdateAnswer";
import withCreateAnswer from "App/QuestionPage/Design/Answers/withCreateAnswer";
import withDeleteAnswer from "App/QuestionPage/Design/Answers/withDeleteAnswer";
import withCreateOption from "App/QuestionPage/Design/Answers/withCreateOption";
import withUpdateOption from "App/QuestionPage/Design/Answers/withUpdateOption";
import withDeleteOption from "App/QuestionPage/Design/Answers/withDeleteOption";
import withCreateExclusive from "App/QuestionPage/Design/Answers/withCreateExclusive";
import withMovePage from "App/QuestionPage/Design/QuestionPageRoute/withMovePage";
import focusOnEntity from "utils/focusOnEntity";
import withDeletePage from "App/QuestionPage/Design/QuestionPageRoute/withDeletePage";
import Loading from "components/Loading";
import Error from "components/Error";
import withCreatePage from "App/QuestionPage/Design/QuestionPageRoute/withCreatePage";
import withDuplicatePage from "App/QuestionPage/Design/QuestionPageRoute/withDuplicatePage";
import withEntityEditor from "App/components/withEntityEditor";

import EditorLayout from "App/QuestionPage/Design/EditorLayout";
import { withPropRenamed } from "utils/enhancers";

import pageFragment from "graphql/fragments/page.graphql";
import { propType } from "graphql-anywhere";

import { Label } from "components/Forms";
import VisuallyHidden from "components/VisuallyHidden";
import AliasEditor from "App/QuestionPage/Design/AliasEditor";

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
      questionPage: propType(QuestionPageEditor.fragments.QuestionPage)
    })
  };

  state = {
    showDeleteConfirmDialog: false,
    showMovePageDialog: false,
    hasError: false
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
    const { onDeletePage, match } = this.props;
    const {
      params: { pageId, sectionId }
    } = match;

    this.handleCloseDeleteConfirmDialog(() => onDeletePage(sectionId, pageId));
  };

  handleAddPage = () => {
    const {
      match: { params },
      page
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
      position: page.position + 1
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

    if (error) {
      return <Error>Something went wrong</Error>;
    }

    if (isEmpty(page)) {
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
  withEntityEditor("page", pageFragment)
);

const WrappedQuestionPageRoute = withQuestionPageEditing(
  UnwrappedQuestionPageRoute
);

export const QUESTION_PAGE_QUERY = gql`
  query GetQuestionPage($id: ID!) {
    questionPage(id: $id) {
      ...QuestionPage
    }
  }

  ${QuestionPageEditor.fragments.QuestionPage}
`;

export default props => (
  <Query
    query={QUESTION_PAGE_QUERY}
    fetchPolicy="cache-and-network"
    variables={{ id: props.match.params.pageId }}
  >
    {innerProps => (
      <WrappedQuestionPageRoute
        {...innerProps}
        {...props}
        page={
          isEmpty(get(innerProps, "data.questionPage", {}))
            ? {}
            : innerProps.data.questionPage
        }
      />
    )}
  </Query>
);
