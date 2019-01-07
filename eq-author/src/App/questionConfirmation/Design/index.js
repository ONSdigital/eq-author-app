import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { propType } from "graphql-anywhere";
import gql from "graphql-tag";
import { flow } from "lodash/fp";

import EditorLayout from "App/questionPage/Design/EditorLayout";
import { Toolbar, Buttons } from "App/questionPage/Design/EditorToolbar";
import Error from "components/Error";
import IconButtonDelete from "components/buttons/IconButtonDelete";
import Loading from "components/Loading";

import withUpdateQuestionConfirmation from "./withUpdateQuestionConfirmation";
import withDeleteQuestionConfirmation from "./withDeleteQuestionConfirmation";

import Editor from "./Editor";

export class UnwrappedQuestionConfirmationRoute extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object, // eslint-disable-line
    data: PropTypes.shape({
      questionConfirmation: propType(Editor.fragments.QuestionConfirmation)
    }),
    onUpdateQuestionConfirmation: PropTypes.func.isRequired,
    onDeleteQuestionConfirmation: PropTypes.func.isRequired
  };

  handleDeleteClick = () => {
    this.props.onDeleteQuestionConfirmation(
      this.props.data.questionConfirmation
    );
  };

  renderContent() {
    const { loading, error, data, onUpdateQuestionConfirmation } = this.props;
    if (loading) {
      return <Loading height="100%">Confirmation is loading</Loading>;
    }
    if (error || !data || !data.questionConfirmation) {
      return <Error>Oh no! Something went wrong</Error>;
    }

    return (
      <>
        <Toolbar>
          <Buttons>
            <IconButtonDelete
              data-test="btn-delete"
              onClick={this.handleDeleteClick}
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
