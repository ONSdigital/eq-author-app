import React, { useState } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { propType } from "graphql-anywhere";
import gql from "graphql-tag";
import { flow } from "lodash/fp";
import EditorLayout from "components/EditorLayout";

import { Toolbar, Buttons } from "App/page/Design/EditorToolbar";
import Error from "components/Error";
import IconButtonDelete from "components/buttons/IconButtonDelete";
import Loading from "components/Loading";
import Modal from "components-themed/Modal";

import withUpdateQuestionConfirmation from "./withUpdateQuestionConfirmation";
import withDeleteQuestionConfirmation from "./withDeleteQuestionConfirmation";
import Editor from "./Editor";
import Panel from "components/Panel";
import ValidationErrorInfoFragment from "graphql/fragments/validationErrorInfo.graphql";
import CommentFragment from "graphql/fragments/comment.graphql";

import { useSetNavigationCallbacksForPage } from "components/NavigationCallbacks";

import {
  DELETE_CONFIRMATION_QUESTION_TITLE,
  DELETE_PAGE_WARNING,
  DELETE_BUTTON_TEXT,
} from "constants/modal-content";

const propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object, // eslint-disable-line
  data: PropTypes.shape({
    questionConfirmation: propType(Editor.fragments.QuestionConfirmation),
  }),
  onUpdateQuestionConfirmation: PropTypes.func.isRequired,
  onDeleteQuestionConfirmation: PropTypes.func.isRequired,
};

export const UnwrappedQuestionConfirmationRoute = ({
  loading,
  error,
  data,
  onUpdateQuestionConfirmation,
  onDeleteQuestionConfirmation,
}) => {
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  const handleDeletePageConfirm = () => {
    setShowDeleteConfirmModal(false);
    onDeleteQuestionConfirmation(data.questionConfirmation);
  };

  useSetNavigationCallbacksForPage({
    page: data?.page,
    folder: data?.page?.folder,
    section: data?.page?.folder?.section,
  });

  const renderContent = () => {
    if (loading) {
      return <Loading height="100%">Confirmation is loading...</Loading>;
    }
    if (error || !data || !data.questionConfirmation) {
      return <Error>Oh no! Something went wrong</Error>;
    }

    const { questionConfirmation } = data;

    return (
      <>
        <Modal
          title={DELETE_CONFIRMATION_QUESTION_TITLE}
          warningMessage={DELETE_PAGE_WARNING}
          positiveButtonText={DELETE_BUTTON_TEXT}
          isOpen={showDeleteConfirmModal}
          onConfirm={handleDeletePageConfirm}
          onClose={() => setShowDeleteConfirmModal(false)}
        />
        <Toolbar>
          <Buttons>
            <IconButtonDelete
              data-test="btn-delete"
              onClick={() => setShowDeleteConfirmModal(true)}
            >
              Delete
            </IconButtonDelete>
          </Buttons>
        </Toolbar>
        <Editor
          confirmation={questionConfirmation}
          onUpdate={onUpdateQuestionConfirmation}
          data-test="editor"
        />
      </>
    );
  };

  return (
    <EditorLayout
      title={data?.questionConfirmation?.displayName || ""}
      pageDescription={data?.questionConfirmation?.pageDescription || ""}
      preview
      logic
      validationErrorInfo={data?.questionConfirmation.validationErrorInfo}
      comments={data?.questionConfirmation.comments}
    >
      <Panel>{renderContent()}</Panel>
    </EditorLayout>
  );
};

UnwrappedQuestionConfirmationRoute.propTypes = propTypes;

const withConfirmationEditing = flow(
  withUpdateQuestionConfirmation,
  withDeleteQuestionConfirmation
);

const CONFIRMATION_QUERY = gql`
  query getQuestionConfirmation($id: ID!) {
    questionConfirmation(id: $id) {
      page {
        id
        position
        folder {
          id
          position
          section {
            id
            position
          }
        }
      }
      ...QuestionConfirmation
      validationErrorInfo {
        ...ValidationErrorInfo
      }
      comments {
        ...Comment
      }
    }
  }
  ${CommentFragment}
  ${Editor.fragments.QuestionConfirmation}
  ${ValidationErrorInfoFragment}
`;

export default withConfirmationEditing((props) => (
  <Query
    query={CONFIRMATION_QUERY}
    variables={{ id: props.match.params.confirmationId }}
  >
    {(queryProps) => (
      <UnwrappedQuestionConfirmationRoute {...props} {...queryProps} />
    )}
  </Query>
));
