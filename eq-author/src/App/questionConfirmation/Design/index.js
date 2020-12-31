import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { propType } from "graphql-anywhere";
import gql from "graphql-tag";
import { flow, getOr } from "lodash/fp";
import EditorLayout from "components/EditorLayout";

import { Toolbar, Buttons } from "App/page/Design/EditorToolbar";
import Error from "components/Error";
import IconButtonDelete from "components/buttons/IconButtonDelete";
import Loading from "components/Loading";
import DeleteConfirmDialog from "components/DeleteConfirmDialog";

import withUpdateQuestionConfirmation from "./withUpdateQuestionConfirmation";
import withDeleteQuestionConfirmation from "./withDeleteQuestionConfirmation";
import questionConfirmationIcon from "./question-confirmation-icon.svg";
import Editor from "./Editor";
import Panel from "components/Panel";
import ValidationErrorInfoFragment from "graphql/fragments/validationErrorInfo.graphql";

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

  handleCloseDeleteConfirmDialog = () => {
    this.setState({ showDeleteConfirmDialog: false });
  };

  handleDeletePageConfirm = () => {
    this.setState({ showDeleteConfirmDialog: false }, () =>
      this.props.onDeleteQuestionConfirmation(
        this.props.data.questionConfirmation
      )
    );
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
    const displayName = getOr(
      "",
      "questionConfirmation.displayName",
      this.props.data
    );

    const pageData = getOr("", "questionConfirmation", this.props.data);

    return (
      <EditorLayout
        title={displayName}
        preview
        logic
        validationErrorInfo={pageData.validationErrorInfo}
      >
        <Panel>{this.renderContent()}</Panel>
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
      validationErrorInfo {
        ...ValidationErrorInfo
      }
    }
  }
  ${Editor.fragments.QuestionConfirmation}
  ${ValidationErrorInfoFragment}
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
