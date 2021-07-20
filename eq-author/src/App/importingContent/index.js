import React, { useState, useEffect } from "react";

import * as Headings from "constants/table-headings";

import QuestionnairesView from "components/QuestionnairesView";
import QuestionnaireSelectModal from "components/modals/QuestionnaireSelectModal";
import ReviewQuestionsModal from "components/modals/ImportQuestionReviewModal";
import QuestionPicker from "components/QuestionPicker";

const SelectQuestionnaire = ({
  isOpen,
  questionnaires = [],
  onSelect,
  onCancel,
}) => {
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);

  const enabledHeadings = [
    Headings.TITLE,
    Headings.OWNER,
    Headings.CREATED,
    Headings.MODIFIED,
  ];

  return (
    <QuestionnaireSelectModal
      isOpen={isOpen}
      onSelect={() => onSelect(selectedQuestionnaire)}
      onClose={onCancel}
      onCancel={onCancel}
      disableSelect={!selectedQuestionnaire}
    >
      <QuestionnairesView
        questionnaires={questionnaires}
        selectedQuestionnaire={selectedQuestionnaire}
        enabledHeadings={enabledHeadings}
        canCreateQuestionnaire={false}
        padding="small"
        onQuestionnaireClick={(questionnaireId) =>
          setSelectedQuestionnaire(
            questionnaires.find(({ id }) => id === questionnaireId)
          )
        }
      />
    </QuestionnaireSelectModal>
  );
};

const ImportingContent = ({ questionnaires, stopImporting }) => {
  /*
   * Modal display states
   */

  //True as it's the first modal in the process
  const [selectingQuestionnaire, setSelectingQuestionnaire] = useState(true);
  const [reviewingQuestions, setReviewingQuestions] = useState(false);
  const [selectingQuestions, setSelectingQuestions] = useState(false);

  /*
   * Data
   */

  const [questionnaireImportingFrom, setQuestionnaireImportingFrom] =
    useState(null);

  /*
   * Handlers
   */

  const onSelectQuestionnaire = (questionnaire) => {
    setQuestionnaireImportingFrom(questionnaire);
    setSelectingQuestionnaire(false);
    setReviewingQuestions(true);
  };

  const onSelectQuestions = () => {
    setReviewingQuestions(false);
    setSelectingQuestions(true);
  };

  const onBackFromReviewingQuestions = () => {
    setReviewingQuestions(false);
    setSelectingQuestionnaire(true);
  };

  const onGlobalCancel = () => {
    setReviewingQuestions(false);
    setSelectingQuestionnaire(false);
    setQuestionnaireImportingFrom(null);
    stopImporting();
  };

  return (
    <>
      {selectingQuestionnaire && (
        <SelectQuestionnaire
          isOpen={selectingQuestionnaire}
          onCancel={onGlobalCancel}
          questionnaires={questionnaires}
          onSelect={onSelectQuestionnaire}
        />
      )}
      {reviewingQuestions && (
        <ReviewQuestionsModal
          isOpen={reviewingQuestions}
          questionnaire={questionnaireImportingFrom}
          onCancel={onGlobalCancel}
          onBack={onBackFromReviewingQuestions}
          onSelectQuestions={onSelectQuestions}
        />
      )}
      {selectingQuestions && (
        <QuestionPicker
          isOpen={selectingQuestions}
          sections={[]}
          startingSelectedQuestions={[]}
          warningPanel="You cannot import folders but you can import any questions they contain."
          showSearch
        />
      )}
    </>
  );
};

export default ImportingContent;
