import React from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";

import Reorder from "components/Reorder";

import withMoveAnswer from "./withMoveAnswer";
import AnswerTransition from "./AnswerTransition";
import AnswerEditor from "./AnswerEditor";

export const AnswersEditor = ({
  answers,
  onUpdate,
  onAddOption,
  onUpdateOption,
  onDeleteOption,
  onAddExclusive,
  onDeleteAnswer,
  moveAnswer,
}) => {
  return (
    <Reorder list={answers} onMove={moveAnswer} Transition={AnswerTransition}>
      {(props, answer) => (
        <AnswerEditor
          {...props}
          answer={answer}
          onUpdate={onUpdate}
          onAddOption={onAddOption}
          onAddExclusive={onAddExclusive}
          onUpdateOption={onUpdateOption}
          onDeleteOption={onDeleteOption}
          onDeleteAnswer={onDeleteAnswer}
        />
      )}
    </Reorder>
  );
};

AnswersEditor.propTypes = {
  answers: PropTypes.arrayOf(propType(AnswerEditor.fragments.AnswerEditor))
    .isRequired,
  onUpdate: PropTypes.func.isRequired,
  onAddOption: PropTypes.func.isRequired,
  onUpdateOption: PropTypes.func.isRequired,
  onDeleteOption: PropTypes.func.isRequired,
  onAddExclusive: PropTypes.func.isRequired,
  onDeleteAnswer: PropTypes.func.isRequired,
  moveAnswer: PropTypes.func.isRequired,
};

AnswersEditor.fragments = {
  AnswersEditor: AnswerEditor.fragments.AnswerEditor,
};

export default withMoveAnswer(AnswersEditor);
