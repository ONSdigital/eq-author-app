import React, { useState, useEffect } from "react";

import * as Headings from "constants/table-headings";

import QuestionnairesView from "components/QuestionnairesView";
import QuestionnaireSelectModal from "components/modals/QuestionnaireSelectModal";
import ReviewQuestionsModal from "components/modals/ImportQuestionReviewModal";

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

const ImportingContent = ({ active, questionnaires }) => {
  // Modal display states
  const [selectingQuestionnaire, setSelectingQuestionnaire] = useState(false);
  const [reviewingQuestions, setReviewingQuestions] = useState(false);

  // Effects
  useEffect(() => setSelectingQuestionnaire(active), [active]);

  // Data
  const [questionnaireImportingFrom, setQuestionnaireImportingFrom] =
    useState(null);

  // Handlers
  const onSelectQuestionnaire = (questionnaire) => {
    setQuestionnaireImportingFrom(questionnaire);
    setSelectingQuestionnaire(false);
    setReviewingQuestions(true);
  };

  const onBackFromReviewingQuestions = () => {
    setReviewingQuestions(false);
    setSelectingQuestionnaire(true);
  };

  const onGlobalCancel = () => {
    setReviewingQuestions(false);
    setSelectingQuestionnaire(false);
    setQuestionnaireImportingFrom(null);
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
        />
      )}
    </>
  );
};

export default ImportingContent;
