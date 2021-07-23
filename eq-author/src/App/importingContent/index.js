import React, { useState } from "react";
import { Query } from "react-apollo";

import { useParams } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { useQuestionnaire } from "components/QuestionnaireContext";

import * as Headings from "constants/table-headings";
import {
  getSectionByPageId,
  getSectionByFolderId,
  getPageById,
  getFolderById,
  getFolderByPageId,
} from "utils/questionnaireUtils";

import GET_QUESTIONNAIRE_LIST from "graphql/getQuestionnaireList.graphql";
import GET_QUESTIONNAIRE from "graphql/getQuestionnaire.graphql";
import IMPORT_CONTENT from "graphql/importContent.graphql";

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

const ImportingContent = ({ stopImporting, targetInsideFolder }) => {
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

  const [questionsToImport, setQuestionsToImport] = useState([]);
  const [questionnaireImportingFrom, setQuestionnaireImportingFrom] =
    useState(null);

  const {
    questionnaireId: currentQuestionnaireId,
    entityName: currentEntityName,
    entityId: currentEntityId,
  } = useParams();

  const { questionnaire: sourceQuestionnaire } = useQuestionnaire();

  /*
   * Handlers
   */

  const [importContent] = useMutation(IMPORT_CONTENT);

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

  const onReviewQuestionsSubmit = (selectedQuestions) => {
    const questionIds = selectedQuestions.map(({ id }) => id);

    let input = {
      questionIds,
      questionnaireId: questionnaireImportingFrom.id,
    };

    switch (currentEntityName) {
      case "section": {
        input.position = {
          sectionId: currentEntityId,
          index: 0,
        };

        break;
      }
      case "folder": {
        const { id: sectionId } = getSectionByFolderId(
          sourceQuestionnaire,
          currentEntityId
        );

        const { position } = getFolderById(
          sourceQuestionnaire,
          currentEntityId
        );

        input.position = {
          sectionId,
        };

        if (targetInsideFolder) {
          input.position.folderId = currentEntityId;
          input.position.index = 0;
        } else {
          input.position.index = position + 1;
        }

        break;
      }
      case "page": {
        const { id: sectionId } = getSectionByPageId(
          sourceQuestionnaire,
          currentEntityId
        );

        input.position = {
          sectionId,
        };

        const {
          enabled: parentFolderIsEnabled,
          id: folderId,
          position: positionOfParentFolder,
        } = getFolderByPageId(sourceQuestionnaire, currentEntityId);

        const { position: positionOfPreviousPage } = getPageById(
          sourceQuestionnaire,
          currentEntityId
        );

        if (parentFolderIsEnabled) {
          input.position.folderId = folderId;
          input.position.index = positionOfPreviousPage + 1;
        } else {
          input.position.index = positionOfParentFolder + 1;
        }

        break;
      }
      default: {
        throw new Error("Unknown entity");
      }
    }

    importContent({ variables: { input } });
    onGlobalCancel();
  };

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
          onConfirm={onReviewQuestionsSubmit}
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
