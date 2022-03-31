import React, { useState } from "react";
import { Query } from "react-apollo";
import PropTypes from "prop-types";

import { useParams } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { useQuestionnaire } from "components/QuestionnaireContext";

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

import QuestionnaireSelectModal from "components/modals/QuestionnaireSelectModal";
import ReviewQuestionsModal from "components/modals/ImportQuestionReviewModal";
import QuestionPicker from "components/QuestionPicker";

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

  // Global

  const onGlobalCancel = () => {
    setReviewingQuestions(false);
    setSelectingQuestionnaire(false);
    setQuestionnaireImportingFrom(null);
    setQuestionsToImport([]);
    stopImporting();
  };

  // Selecting a questionnaire

  const onSelectQuestionnaire = (questionnaire) => {
    setQuestionnaireImportingFrom(questionnaire);
    setSelectingQuestionnaire(false);
    setReviewingQuestions(true);
  };

  // Selecting questions to import

  const onQuestionPickerCancel = () => {
    setSelectingQuestions(false);
    setReviewingQuestions(true);
  };

  const onQuestionPickerSubmit = (selection) => {
    setQuestionsToImport(selection);
    setSelectingQuestions(false);
    setReviewingQuestions(true);
  };

  // Reviewing questions to import

  const onSelectQuestions = () => {
    setReviewingQuestions(false);
    setSelectingQuestions(true);
  };

  const onBackFromReviewingQuestions = () => {
    setReviewingQuestions(false);
    setSelectingQuestionnaire(true);
    setQuestionsToImport([]);
  };

  const onRemoveAllSelectedQuestions = () => setQuestionsToImport([]);

  const onRemoveSingleSelectedQuestion = (index) => {
    const filteredQuestions = questionsToImport.filter((_, i) => i !== index);
    setQuestionsToImport(filteredQuestions);
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
          position,
        } = getFolderByPageId(sourceQuestionnaire, currentEntityId);

        const { position: positionOfPreviousPage } = getPageById(
          sourceQuestionnaire,
          currentEntityId
        );

        if (parentFolderIsEnabled) {
          input.position.folderId = folderId;
          input.position.index = positionOfPreviousPage + 1;
        } else {
          input.position.folderId = folderId;
          input.position.index = 0;
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
              return <React.Fragment />;
            }

            if (error || !data) {
              return <React.Fragment />;
            }

            return (
              <QuestionnaireSelectModal
                isOpen={selectingQuestionnaire}
                onSelect={onSelectQuestionnaire}
                onClose={onGlobalCancel}
                onCancel={onGlobalCancel}
                questionnaires={data.questionnaires || []}
              />
            );
          }}
        </Query>
      )}
      {reviewingQuestions && (
        <ReviewQuestionsModal
          isOpen={reviewingQuestions}
          questionnaire={questionnaireImportingFrom}
          startingSelectedQuestions={questionsToImport}
          onCancel={onGlobalCancel}
          onConfirm={onReviewQuestionsSubmit}
          onBack={onBackFromReviewingQuestions}
          onSelectQuestions={onSelectQuestions}
          onRemoveAll={onRemoveAllSelectedQuestions}
          onRemoveSingle={onRemoveSingleSelectedQuestion}
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
              return <React.Fragment />;
            }

            if (error || !data) {
              return <React.Fragment />;
            }

            const { sections } = data.questionnaire;

            return (
              <QuestionPicker
                title="Select the question(s) to import"
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

ImportingContent.propTypes = {
  stopImporting: PropTypes.func.isRequired,
  targetInsideFolder: PropTypes.bool,
};

export default ImportingContent;
