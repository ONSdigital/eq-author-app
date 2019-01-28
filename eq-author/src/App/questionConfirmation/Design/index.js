import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { propType } from "graphql-anywhere";
import gql from "graphql-tag";
import { flow } from "lodash/fp";
import { isFunction } from "lodash";
import EditorLayout from "App/questionPage/Design/EditorLayout";

import { Toolbar, Buttons } from "App/questionPage/Design/EditorToolbar";
import Error from "components/Error";
import IconButtonDelete from "components/buttons/IconButtonDelete";
import Loading from "components/Loading";
import DeleteConfirmDialog from "components/DeleteConfirmDialog";

import withUpdateQuestionConfirmation from "./withUpdateQuestionConfirmation";
import withDeleteQuestionConfirmation from "./withDeleteQuestionConfirmation";
import questionConfirmationIcon from "./question-confirmation-icon.svg";
import Editor from "./Editor";

export class UnwrappedQuestionConfirmationRoute extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object, // eslint-disable-line
    data: PropTypes.shape({
      questionConfirmation: propType(Editor.fragments.QuestionConfirmation),
    }),
    onUpdateQuestionConfirmation: PropTypes.func.isRequired,
    onDeleteQuestionConfirmation: PropTypes.func.isRequired,
  };

  state = {
    showDeleteConfirmDialog: false,
  };

  handleOpenDeleteConfirmDialog = () =>
    this.setState({ showDeleteConfirmDialog: true });

  handleCloseDeleteConfirmDialog = cb =>
    this.setState(
      { showDeleteConfirmDialog: false },
      isFunction(cb) ? cb : null
    );

  handleDeletePageConfirm = () => {
    this.handleCloseDeleteConfirmDialog(() => {
      this.props.onDeleteQuestionConfirmation(
        this.props.data.questionConfirmation
      );
    });
  };

  renderContent() {
    const { loading, error, data, onUpdateQuestionConfirmation } = this.props;
    const { showDeleteConfirmDialog } = this.state;

    if (loading) {
      return <Loading height="100%">Confirmation is loading</Loading>;
    }
    if (error || !data || !data.questionConfirmation) {
      return <Error>Oh no! Something went wrong</Error>;
    }

    return (
      <>
        <DeleteConfirmDialog
          isOpen={showDeleteConfirmDialog}
          onClose={this.handleCloseDeleteConfirmDialog}
          onDelete={this.handleDeletePageConfirm}
          title={data.questionConfirmation.displayName}
          alertText="All edits will be removed."
          icon={questionConfirmationIcon}
          data-test="delete-question-confirmation"
        />
        <Toolbar>
          <Buttons>
            <IconButtonDelete
              data-test="btn-delete"
              onClick={this.handleOpenDeleteConfirmDialog}
            >
              Delete
            </IconButtonDelete>
          </Buttons>
        </Toolbar>
        <Editor
          confirmation={data.questionConfirmation}
          onUpdate={onUpdateQuestionConfirmation}
          data-test="editor"
        />
      </>
    );
  }

  render() {
    return (
      <EditorLayout page={this.props.data.questionConfirmation} preview>
        {this.renderContent()}
      </EditorLayout>
    );
  }
}

const withConfirmationEditing = flow(
  withUpdateQuestionConfirmation,
  withDeleteQuestionConfirmation
);

const CONFIRMATION_QUERY = gql`
  query getQuestionConfirmation($id: ID!) {
    questionConfirmation(id: $id) {
      ...QuestionConfirmation
    }
  }

  ${Editor.fragments.QuestionConfirmation}
`;

export default withConfirmationEditing(props => (
  <Query
    query={CONFIRMATION_QUERY}
    variables={{ id: props.match.params.confirmationId }}
  >
    {queryProps => (
      <UnwrappedQuestionConfirmationRoute {...props} {...queryProps} />
    )}
  </Query>
));
