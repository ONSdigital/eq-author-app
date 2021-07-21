import React, { useState } from "react";
import { Query } from "react-apollo";
import { useParams, useLocation } from "react-router-dom";

import * as Headings from "constants/table-headings";

import GET_QUESTIONNAIRE_LIST from "graphql/getQuestionnaireList.graphql";
import GET_QUESTIONNAIRE from "graphql/getQuestionnaire.graphql";

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

const ImportingContent = ({ stopImporting }) => {
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

  const [questionsToImport, setQuestionsToImport] = useState([]);

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

  const onQuestionPickerCancel = () => {
    setSelectingQuestions(false);
    setReviewingQuestions(true);
  };

  const onQuestionPickerSubmit = (selection) => {
    setQuestionsToImport(selection);
    setSelectingQuestions(false);
    setReviewingQuestions(true);
  };

  const onGlobalCancel = () => {
    setReviewingQuestions(false);
    setSelectingQuestionnaire(false);
    setQuestionnaireImportingFrom(null);
    stopImporting();
  };

  const { questionnaireId: currentQuestionnaireId } = useParams();

  return (
    <>
      {selectingQuestionnaire && (
        <Query
          query={GET_QUESTIONNAIRE_LIST}
          variables={{
            input: { filter: { ne: { ids: [currentQuestionnaireId] } } },
          }}
        >
          {({ loading, error, data }) => {
            if (loading) {
              return <p>Loading</p>;
            }

            if (error || !data) {
              return <p>Error</p>;
            }

            return (
              <SelectQuestionnaire
                isOpen={selectingQuestionnaire}
                onCancel={onGlobalCancel}
                questionnaires={data.questionnaires}
                onSelect={onSelectQuestionnaire}
              />
            );
          }}
        </Query>
      )}
      {reviewingQuestions && (
        <ReviewQuestionsModal
          isOpen={reviewingQuestions}
          questionnaire={questionnaireImportingFrom}
          onCancel={onGlobalCancel}
          onBack={onBackFromReviewingQuestions}
          onSelectQuestions={onSelectQuestions}
          startingSelectedQuestions={questionsToImport}
        />
      )}
      {selectingQuestions && (
        <Query
          query={GET_QUESTIONNAIRE}
          variables={{
            input: { questionnaireId: questionnaireImportingFrom.id },
          }}
        >
          {({ loading, error, data }) => {
            if (loading) {
              return <p>Loading</p>;
            }

            if (error || !data) {
              return <p>Error</p>;
            }

            const { sections } = data.questionnaire;

            return (
              <QuestionPicker
                isOpen={selectingQuestions}
                sections={sections}
                startingSelectedQuestions={questionsToImport}
                warningPanel="You cannot import folders but you can import any questions they contain."
                showSearch
                onClose={onGlobalCancel}
                onCancel={onQuestionPickerCancel}
                onSubmit={onQuestionPickerSubmit}
              />
            );
          }}
        </Query>
      )}
    </>
  );
};

export default ImportingContent;
