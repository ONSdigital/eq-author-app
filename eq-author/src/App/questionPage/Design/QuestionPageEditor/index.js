import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import gql from "graphql-tag";

import DeleteConfirmDialog from "components/DeleteConfirmDialog";

import Page from "graphql/fragments/page.graphql";

import getIdForObject from "utils/getIdForObject";

import AnswersEditor from "./AnswersEditor";
import AnswerTypeSelector from "./AnswerTypeSelector";
import MovePageModal from "./MovePageModal";
import MovePageQuery from "./MovePageModal/MovePageQuery";

import MetaEditor from "./MetaEditor";
import AdditionalInfo from "./AdditionalInfo";
import iconPage from "./icon-dialog-page.svg";

const QuestionSegment = styled.div`
  padding: 0 2em;
`;

const AddAnswerSegment = styled.div`
  padding: 1em 2em 2em;
`;

export default class QuestionPageEditor extends React.Component {
  static propTypes = {
    onUpdateAnswer: PropTypes.func.isRequired,
    onUpdatePage: PropTypes.func.isRequired,
    onAddAnswer: PropTypes.func.isRequired,
    onAddOption: PropTypes.func.isRequired,
    onDeleteOption: PropTypes.func.isRequired,
    onDeleteAnswer: PropTypes.func.isRequired,
    onUpdateOption: PropTypes.func.isRequired,
    onMovePage: PropTypes.func.isRequired,
    showMovePageDialog: PropTypes.bool.isRequired,
    onAddExclusive: PropTypes.func.isRequired,
    onDeletePageConfirm: PropTypes.func.isRequired,
    onCloseDeleteConfirmDialog: PropTypes.func.isRequired,
    showDeleteConfirmDialog: PropTypes.bool.isRequired,
    onCloseMovePageDialog: PropTypes.func.isRequired,
    match: CustomPropTypes.match,
    page: CustomPropTypes.page.isRequired,
    onChange: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
  };

  handleDeleteAnswer = answerId => {
    this.props.onDeleteAnswer(this.props.page.id, answerId);
  };

  renderMovePageModal = ({ loading, error, data }) => {
    const {
      onMovePage,
      showMovePageDialog,
      onCloseMovePageDialog,
      match,
      page,
    } = this.props;

    if (loading || error) {
      return null;
    }

    return (
      <MovePageModal
        questionnaire={data.questionnaire}
        isOpen={showMovePageDialog}
        onClose={onCloseMovePageDialog}
        onMovePage={onMovePage}
        sectionId={match.params.sectionId}
        page={page}
      />
    );
  };

  render() {
    const {
      onAddAnswer,
      showDeleteConfirmDialog,
      onCloseDeleteConfirmDialog,
      onDeletePageConfirm,
      match,
      page,
      page: { answers },
      onChange,
      onUpdate,
      onUpdateAnswer,
      onAddOption,
      onUpdateOption,
      onDeleteOption,
      onAddExclusive,
    } = this.props;

    const id = getIdForObject(page);

    return (
      <div data-test="question-page-editor">
        <div>
          <QuestionSegment id={id}>
            <MetaEditor onChange={onChange} onUpdate={onUpdate} page={page} />
            <DeleteConfirmDialog
              isOpen={showDeleteConfirmDialog}
              onClose={onCloseDeleteConfirmDialog}
              onDelete={onDeletePageConfirm}
              title={page.displayName}
              alertText="All edits, properties and routing settings will also be removed."
              icon={iconPage}
              data-test="delete-page"
            />
            <MovePageQuery questionnaireId={match.params.questionnaireId}>
              {this.renderMovePageModal}
            </MovePageQuery>
          </QuestionSegment>
          <AnswersEditor
            answers={answers}
            onUpdate={onUpdateAnswer}
            onAddOption={onAddOption}
            onAddExclusive={onAddExclusive}
            onUpdateOption={onUpdateOption}
            onDeleteOption={onDeleteOption}
            onDeleteAnswer={this.handleDeleteAnswer}
            data-test="answers-editor"
          />
        </div>

        <AddAnswerSegment>
          <AnswerTypeSelector
            answerCount={answers.length}
            onSelect={onAddAnswer}
            data-test="add-answer"
          />
        </AddAnswerSegment>
        <QuestionSegment>
          <AdditionalInfo onChange={onChange} onUpdate={onUpdate} page={page} />
        </QuestionSegment>
      </div>
    );
  }
}

QuestionPageEditor.fragments = {
  QuestionPage: gql`
    fragment QuestionPage on QuestionPage {
      ...Page
      displayName
      position
      answers {
        ...AnswerEditor
      }
      section {
        id
        questionnaire {
          id
          metadata {
            id
            displayName
          }
        }
      }
    }
    ${Page}
    ${AnswersEditor.fragments.AnswersEditor}
  `,
};
