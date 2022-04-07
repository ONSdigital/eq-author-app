import React, { useState } from "react";
import { Query } from "react-apollo";
import PropTypes from "prop-types";

import { useParams } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { useQuestionnaire } from "components/QuestionnaireContext";

import {
  getSectionByPageId,
  getSectionByFolderId,
  getSectionById,
  getPageById,
  getFolderById,
  getFolderByPageId,
} from "utils/questionnaireUtils";

import GET_QUESTIONNAIRE_LIST from "graphql/getQuestionnaireList.graphql";
import GET_QUESTIONNAIRE from "graphql/getQuestionnaire.graphql";
import IMPORT_QUESTIONS from "graphql/importQuestions.graphql";
import IMPORT_SECTIONS from "graphql/importSections.graphql";

import QuestionnaireSelectModal from "components/modals/QuestionnaireSelectModal";
import ReviewQuestionsModal from "components/modals/ImportQuestionReviewModal";
import ReviewSectionsModal from "components/modals/ImportSectionReviewModal";
import SelectContentModal from "components/modals/ImportContentModal";
import QuestionPicker from "components/QuestionPicker";
import SectionPicker from "components/SectionPicker";

const ImportingContent = ({ stopImporting, targetInsideFolder }) => {
  /*
   * Modal display states
   */

  //True as it's the first modal in the process
  const [selectingQuestionnaire, setSelectingQuestionnaire] = useState(true);
  const [reviewingQuestions, setReviewingQuestions] = useState(false);
  const [selectingQuestions, setSelectingQuestions] = useState(false);
  const [reviewingSections, setReviewingSections] = useState(false);
  const [selectingSections, setSelectingSections] = useState(false);
  const [selectingContent, setSelectingContent] = useState(false);
  /*
   * Data
   */

  const [questionsToImport, setQuestionsToImport] = useState([]);
  const [questionnaireImportingFrom, setQuestionnaireImportingFrom] =
    useState(null);

  const [sectionsToImport, setSectionsToImport] = useState([]);
  const [sectionsImportingFrom, setSectionsImportingFrom] = useState(null);

  const {
    questionnaireId: currentQuestionnaireId,
    entityName: currentEntityName,
    entityId: currentEntityId,
  } = useParams();

  const { questionnaire: sourceQuestionnaire } = useQuestionnaire();

  /*
   * Handlers
   */

  const [importQuestions] = useMutation(IMPORT_QUESTIONS);
  const [importSections] = useMutation(IMPORT_SECTIONS);

  // Global

  const onGlobalCancel = () => {
    setReviewingQuestions(false);
    setSelectingQuestionnaire(false);
    setQuestionnaireImportingFrom(null);
    setQuestionsToImport([]);
    stopImporting();
    setReviewingSections(false);
    setSelectingSections(false);
    setSelectingContent(false);
  };

  // Selecting a questionnaire

  const onSelectQuestionnaire = (questionnaire) => {
    setQuestionnaireImportingFrom(questionnaire);
    setSelectingQuestionnaire(false);
    setReviewingQuestions(false);
    setReviewingSections(false);
    setSelectingContent(true);
  };

  // Selecting questions to import

  const onQuestionPickerCancel = () => {
    setSelectingQuestions(false);
    setReviewingQuestions(true);
    setReviewingSections(false);
    setSelectingSections(false);
    setSelectingContent(false);
  };

  const onQuestionPickerSubmit = (selection) => {
    setQuestionsToImport(selection);
    setSelectingQuestions(false);
    setReviewingQuestions(true);
    setReviewingSections(false);
    setSelectingSections(false);
    setSelectingContent(false);
  };

  // Reviewing questions to import

  const onSelectQuestions = () => {
    setReviewingQuestions(false);
    setSelectingQuestions(true);
    setReviewingSections(false);
    setSelectingSections(false);
    setSelectingContent(false);
  };

  const onBackFromReviewingQuestions = () => {
    setReviewingQuestions(false);
    setSelectingQuestionnaire(true);
    setQuestionsToImport([]);
    setReviewingSections(false);
    setSelectingSections(false);
    setSelectingContent(false);
  };

  const onRemoveAllSelectedQuestions = () => {
    if (reviewingQuestions) {
      setQuestionsToImport([]);
    } else {
      setSectionsToImport([]);
    }
  };

  const onRemoveSingleSelectedQuestion = (index) => {
    if (reviewingQuestions) {
      const filteredQuestions = questionsToImport.filter((_, i) => i !== index);
      setQuestionsToImport(filteredQuestions);
    } else {
      const filteredSections = sectionsToImport.filter((_, i) => i !== index);
      setSectionsToImport(filteredSections);
    }
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

        const { id: folderId } = getFolderByPageId(
          sourceQuestionnaire,
          currentEntityId
        );

        const { position: positionOfPreviousPage } = getPageById(
          sourceQuestionnaire,
          currentEntityId
        );

        input.position.folderId = folderId;
        input.position.index = positionOfPreviousPage + 1;

        break;
      }
      default: {
        throw new Error("Unknown entity");
      }
    }

    importQuestions({ variables: { input } });
    onGlobalCancel();
  };

  // Selecting sections to import

  const onSectionPickerCancel = () => {
    setSelectingSections(false);
    setReviewingSections(true);
    setSelectingQuestions(false);
    setReviewingQuestions(false);
    setSelectingContent(false);
  };

  const onSectionPickerSubmit = (selection) => {
    setSectionsToImport(selection);
    setSelectingSections(false);
    setReviewingSections(true);
    setSelectingQuestions(false);
    setReviewingQuestions(false);
    setSelectingContent(false);
  };

  // Reviewing sections to import

  const onSelectSections = () => {
    setReviewingSections(false);
    setSelectingSections(true);
    setSelectingQuestions(false);
    setReviewingQuestions(false);
    setSelectingContent(false);
  };

  const onBackFromReviewingSections = () => {
    setSelectingQuestionnaire(true);
    setSectionsToImport([]);
    setReviewingSections(false);
    setSelectingQuestions(false);
    setReviewingQuestions(false);
    setSelectingContent(false);
  };

  const onRemoveAllSelectedSections = () => setSectionsToImport([]);

  const onRemoveSingleSelectedSection = (index) => {
    const filteredSections = sectionsToImport.filter((_, i) => i !== index);
    setSectionsToImport(filteredSections);
  };

  const onReviewSectionsSubmit = (selectedSections) => {
    const sectionIds = selectedSections.map(({ id }) => id);

    let input = {
      sectionIds,
      questionnaireId: questionnaireImportingFrom.id,
    };

    switch (currentEntityName) {
      case "section": {
        const { position } = getSectionById(
          sourceQuestionnaire,
          currentEntityId
        );

        input.position = {
          sectionId: currentEntityId,
          index: position + 1,
        };

        break;
      }
      case "folder": {
        const { id: sectionId, position: positionOfParentSection } =
          getSectionByFolderId(sourceQuestionnaire, currentEntityId);

        input.position = {
          sectionId,
        };

        input.position.index = positionOfParentSection + 1;

        break;
      }
      case "page": {
        const { id: sectionId, position: positionOfParentSection } =
          getSectionByPageId(sourceQuestionnaire, currentEntityId);

        input.position = {
          sectionId,
        };

        input.position.index = positionOfParentSection + 1;

        break;
      }
      default: {
        throw new Error("Unknown entity");
      }
    }

    importSections({ variables: { input } });
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
      {selectingContent && (
        <SelectContentModal
          isOpen={selectingContent}
          questionnaire={questionnaireImportingFrom}
          onCancel={onGlobalCancel}
          onConfirm={onReviewQuestionsSubmit}
          onBack={onBackFromReviewingQuestions}
          onSelectQuestions={onSelectQuestions}
          onSelectSections={onSelectSections}
        />
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
      {reviewingSections && (
        <ReviewSectionsModal
          isOpen={reviewingSections}
          questionnaire={questionnaireImportingFrom}
          startingSelectedSections={sectionsToImport}
          onCancel={onGlobalCancel}
          onConfirm={onReviewSectionsSubmit}
          onBack={onBackFromReviewingSections}
          onSelectSections={onSelectSections}
          onRemoveAll={onRemoveAllSelectedSections}
          onRemoveSingle={onRemoveSingleSelectedSection}
        />
      )}
      {selectingSections && (
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
              <SectionPicker
                title="Select the section(s) to import"
                isOpen={selectingSections}
                sections={sections}
                startingSelectedSections={sectionsToImport}
                warningPanel="You cannot import folders but you can import any questions they contain."
                showSearch
                onClose={onGlobalCancel}
                onCancel={onSectionPickerCancel}
                onSubmit={onSectionPickerSubmit}
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
