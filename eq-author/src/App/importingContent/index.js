import React, { useState } from "react";
import { Query } from "react-apollo";
import PropTypes from "prop-types";
import styled from "styled-components";

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
import IMPORT_FOLDERS from "graphql/importFolders.graphql";
import IMPORT_SECTIONS from "graphql/importSections.graphql";

import QuestionnaireSelectModal from "components/modals/QuestionnaireSelectModal";
import ReviewQuestionsModal from "components/modals/ImportQuestionReviewModal";
import ReviewFoldersModal from "components/modals/ImportFolderReviewModal";
import ReviewSectionsModal from "components/modals/ImportSectionReviewModal";
import SelectContentModal from "components/modals/ImportContentModal";
import QuestionPicker from "components/QuestionPicker";
import FolderPicker from "components/FolderPicker";
import SectionPicker from "components/SectionPicker";
import ExtraSpaceConfirmationModal from "components-themed/Modal";

import {
  ListCollectorQualifierPage,
  ListCollectorConfirmationPage,
} from "constants/page-types";

const ExtraSpaceModalWrapper = styled.div`
  .modal-button-container {
    margin-top: 1em;
  }
`;

const ImportingContent = ({
  stopImporting,
  targetInsideFolder,
  targetIsListCollectorFolder,
}) => {
  /*
   * Modal display states
   */

  //True as it's the first modal in the process
  const [selectingQuestionnaire, setSelectingQuestionnaire] = useState(true);
  const [reviewingQuestions, setReviewingQuestions] = useState(false);
  const [selectingQuestions, setSelectingQuestions] = useState(false);
  const [reviewingFolders, setReviewingFolders] = useState(false);
  const [selectingFolders, setSelectingFolders] = useState(false);
  const [reviewingSections, setReviewingSections] = useState(false);
  const [selectingSections, setSelectingSections] = useState(false);
  const [selectingContent, setSelectingContent] = useState(false);
  const [showQuestionExtraSpaceModal, setShowQuestionExtraSpaceModal] =
    useState(false);
  const [showFolderExtraSpaceModal, setShowFolderExtraSpaceModal] =
    useState(false);
  const [showSectionExtraSpaceModal, setShowSectionExtraSpaceModal] =
    useState(false);

  /*
   * Data
   */

  const [questionsToImport, setQuestionsToImport] = useState([]);
  const [questionnaireImportingFrom, setQuestionnaireImportingFrom] =
    useState(null);

  const [foldersToImport, setFoldersToImport] = useState([]);

  const [sectionsToImport, setSectionsToImport] = useState([]);

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
  const [importFolders] = useMutation(IMPORT_FOLDERS);
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
    setSelectingFolders(false);
    setReviewingFolders(false);
    setSelectingContent(false);
    setShowQuestionExtraSpaceModal(false);
    setShowSectionExtraSpaceModal(false);
  };

  // Selecting a questionnaire

  const onSelectQuestionnaire = (questionnaire) => {
    setQuestionnaireImportingFrom(questionnaire);
    setSelectingQuestionnaire(false);
    setReviewingQuestions(false);
    setReviewingFolders(false);
    setReviewingSections(false);
    setSelectingContent(true);
  };

  // Selecting questions to import

  const onQuestionPickerCancel = () => {
    setSelectingQuestions(false);
    setReviewingQuestions(true);
    setReviewingSections(false);
    setSelectingSections(false);
    setSelectingFolders(false);
    setReviewingFolders(false);
    setSelectingContent(false);
  };

  const onQuestionPickerSubmit = (selection) => {
    setQuestionsToImport(selection);
    setSelectingQuestions(false);
    setReviewingQuestions(true);
    setReviewingSections(false);
    setSelectingSections(false);
    setSelectingFolders(false);
    setReviewingFolders(false);
    setSelectingContent(false);
  };

  // Reviewing questions to import

  const onSelectQuestions = () => {
    setReviewingQuestions(false);
    setSelectingQuestions(true);
    setReviewingSections(false);
    setSelectingSections(false);
    setSelectingFolders(false);
    setReviewingFolders(false);
    setSelectingContent(false);
  };

  const onBackFromReviewingQuestions = () => {
    setReviewingQuestions(false);
    setSelectingQuestionnaire(true);
    setQuestionsToImport([]);
    setSelectingFolders(false);
    setReviewingFolders(false);
    setReviewingSections(false);
    setSelectingSections(false);
    setSelectingContent(false);
  };

  // Selecting folders to import

  const onFolderPickerCancel = () => {
    setSelectingQuestions(false);
    setReviewingQuestions(false);
    setReviewingSections(false);
    setSelectingSections(false);
    setSelectingFolders(false);
    setReviewingFolders(true);
    setSelectingContent(false);
  };

  const onFolderPickerSubmit = (selection) => {
    setFoldersToImport(selection);
    setSelectingQuestions(false);
    setReviewingQuestions(false);
    setReviewingSections(false);
    setSelectingSections(false);
    setSelectingFolders(false);
    setReviewingFolders(true);
    setSelectingContent(false);
  };

  // Reviewing folders to import

  const onSelectFolders = () => {
    setReviewingQuestions(false);
    setSelectingQuestions(false);
    setSelectingFolders(true);
    setReviewingFolders(false);
    setReviewingSections(false);
    setSelectingSections(false);
    setSelectingContent(false);
  };

  const onBackFromReviewingFolders = () => {
    setFoldersToImport([]);
    setReviewingQuestions(false);
    setSelectingQuestionnaire(true);
    setSelectingFolders(false);
    setReviewingFolders(false);
    setReviewingSections(false);
    setSelectingSections(false);
    setSelectingContent(false);
  };

  const onRemoveAllSelectedContent = () => {
    if (reviewingQuestions) {
      setQuestionsToImport([]);
    }
    if (reviewingFolders) {
      setFoldersToImport([]);
    }
    if (reviewingSections) {
      setSectionsToImport([]);
    }
  };

  const onRemoveSingleSelectedContent = (index) => {
    if (reviewingQuestions) {
      const filteredQuestions = questionsToImport.filter((_, i) => i !== index);
      setQuestionsToImport(filteredQuestions);
    }
    if (reviewingFolders) {
      const filteredFolders = foldersToImport.filter((_, i) => i !== index);
      setFoldersToImport(filteredFolders);
    }
    if (reviewingSections) {
      const filteredSections = sectionsToImport.filter((_, i) => i !== index);
      setSectionsToImport(filteredSections);
    }
  };

  // Checks if inputData contains extra spaces, including all strings, array items and object values
  const containsExtraSpaces = (inputData) => {
    // Does not check for extra spaces if inputData is null or undefined
    if (inputData != null) {
      // Checks if inputData is a string containing extra spaces
      if (typeof inputData === "string") {
        // Removes opening and closing HTML tags from the start and end of the string
        const inputDataWithoutTags = inputData
          .replace(/^(<\/?[^>]+>)+/, "")
          .replace(/(<\/?[^>]+>)+$/, "");

        // Checks for consecutive, leading and trailing spaces
        if (
          /\s{2,}/g.test(inputDataWithoutTags) ||
          inputDataWithoutTags.trim() !== inputDataWithoutTags
        ) {
          return true;
        }
      }
      // If inputData is an array, recursively calls containsExtraSpaces to return true if any of its items contain extra spaces
      else if (Array.isArray(inputData)) {
        return inputData.some((element) => containsExtraSpaces(element));
      }
      // If inputData is an object, recursively calls containsExtraSpaces to return true if any of its values contain extra spaces
      else if (typeof inputData === "object") {
        return Object.values(inputData).some((value) =>
          containsExtraSpaces(value)
        );
      }
      // If inputData is a different type, return false as it does not contain extra spaces
      else {
        return false;
      }
    }
  };

  const isInsideRepeatingSection = () => {
    switch (currentEntityName) {
      case "section": {
        const section = getSectionById(sourceQuestionnaire, currentEntityId);
        return section.repeatingSection;
      }
      case "folder": {
        const section = getSectionByFolderId(
          sourceQuestionnaire,
          currentEntityId
        );
        return section.repeatingSection;
      }
      case "page": {
        const section = getSectionByPageId(
          sourceQuestionnaire,
          currentEntityId
        );
        return section.repeatingSection;
      }
      default: {
        return false;
      }
    }
  };

  const onReviewQuestionsSubmit = (selectedQuestions) => {
    const questionIds = selectedQuestions.map(({ id }) => id);
    let questionContainsExtraSpaces = false;

    selectedQuestions.forEach((selectedQuestion) => {
      if (containsExtraSpaces(selectedQuestion)) {
        questionContainsExtraSpaces = true;
      }
    });

    if (questionContainsExtraSpaces && !showQuestionExtraSpaceModal) {
      setReviewingQuestions(false);
      setSelectingQuestions(false);
      setReviewingSections(false);
      setSelectingSections(false);
      setSelectingFolders(false);
      setReviewingFolders(false);
      setSelectingContent(false);
      setShowQuestionExtraSpaceModal(true);
    } else {
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

          const { listId, position } = getFolderById(
            sourceQuestionnaire,
            currentEntityId
          );

          input.position = {
            sectionId,
          };

          if (targetInsideFolder) {
            if (listId != null) {
              input.position.folderId = currentEntityId;
              input.position.index = 2;
            } else {
              input.position.folderId = currentEntityId;
              input.position.index = 0;
            }
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

          const { id: folderId, position: folderPosition } = getFolderByPageId(
            sourceQuestionnaire,
            currentEntityId
          );

          const { pageType, position: positionOfPreviousPage } = getPageById(
            sourceQuestionnaire,
            currentEntityId
          );

          if (pageType === ListCollectorConfirmationPage) {
            input.position.index = folderPosition + 1;
          } else if (pageType === ListCollectorQualifierPage) {
            input.position.folderId = folderId;
            input.position.index = positionOfPreviousPage + 2;
          } else {
            input.position.folderId = folderId;
            input.position.index = positionOfPreviousPage + 1;
          }

          break;
        }
        default: {
          throw new Error("Unknown entity");
        }
      }

      importQuestions({
        variables: { input },
        refetchQueries: ["GetQuestionnaire"],
      });
      onGlobalCancel();
    }
  };

  const onReviewFoldersSubmit = (selectedFolders) => {
    const folderIds = selectedFolders.map(({ id }) => id);
    let folderContainsExtraSpaces = false;

    selectedFolders.forEach((selectedFolder) => {
      if (containsExtraSpaces(selectedFolder)) {
        folderContainsExtraSpaces = true;
      }
    });

    if (folderContainsExtraSpaces && !showFolderExtraSpaceModal) {
      setReviewingQuestions(false);
      setSelectingQuestions(false);
      setReviewingSections(false);
      setSelectingSections(false);
      setSelectingFolders(false);
      setReviewingFolders(false);
      setSelectingContent(false);
      setShowFolderExtraSpaceModal(true);
    } else {
      let input = {
        folderIds,
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

          input.position.index = position + 1;

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

          const { position: folderPosition } = getFolderByPageId(
            sourceQuestionnaire,
            currentEntityId
          );

          input.position.index = folderPosition + 1;

          break;
        }
        default: {
          throw new Error("Unknown entity");
        }
      }

      importFolders({
        variables: { input },
        refetchQueries: ["GetQuestionnaire"],
      });
      onGlobalCancel();
    }
  };

  // Selecting sections to import

  const onSectionPickerCancel = () => {
    setSelectingSections(false);
    setReviewingSections(true);
    setSelectingQuestions(false);
    setReviewingQuestions(false);
    setSelectingFolders(false);
    setReviewingFolders(false);
    setSelectingContent(false);
  };

  const onSectionPickerSubmit = (selection) => {
    setSectionsToImport(selection);
    setSelectingSections(false);
    setReviewingSections(true);
    setSelectingQuestions(false);
    setReviewingQuestions(false);
    setSelectingFolders(false);
    setReviewingFolders(false);
    setSelectingContent(false);
  };

  // Reviewing sections to import

  const onSelectSections = () => {
    setReviewingSections(false);
    setSelectingSections(true);
    setSelectingQuestions(false);
    setReviewingQuestions(false);
    setSelectingFolders(false);
    setReviewingFolders(false);
    setSelectingContent(false);
  };

  const onBackFromReviewingSections = () => {
    setSelectingQuestionnaire(true);
    setSectionsToImport([]);
    setReviewingSections(false);
    setSelectingQuestions(false);
    setReviewingQuestions(false);
    setSelectingFolders(false);
    setReviewingFolders(false);
    setSelectingContent(false);
  };

  const onReviewSectionsSubmit = (selectedSections) => {
    const sectionIds = selectedSections.map(({ id }) => id);
    let sectionContainsExtraSpaces = false;

    selectedSections.forEach((selectedSection) => {
      if (containsExtraSpaces(selectedSection)) {
        sectionContainsExtraSpaces = true;
      }
    });

    if (sectionContainsExtraSpaces && !showSectionExtraSpaceModal) {
      setReviewingQuestions(false);
      setSelectingQuestions(false);
      setReviewingSections(false);
      setSelectingSections(false);
      setSelectingContent(false);
      setSelectingFolders(false);
      setReviewingFolders(false);
      setShowQuestionExtraSpaceModal(false);
      setShowSectionExtraSpaceModal(true);
    } else {
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

      importSections({
        variables: { input },
        refetchQueries: ["GetQuestionnaire"],
      });
      onGlobalCancel();
    }
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
          onBack={onBackFromReviewingQuestions}
          onSelectQuestions={onSelectQuestions}
          onSelectFolders={onSelectFolders}
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
          onSelectFolders={onSelectFolders}
          onSelectSections={onSelectSections}
          onRemoveAll={onRemoveAllSelectedContent}
          onRemoveSingle={onRemoveSingleSelectedContent}
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
                showSearch
                onClose={onGlobalCancel}
                onCancel={onQuestionPickerCancel}
                onSubmit={onQuestionPickerSubmit}
                targetIsListCollectorFolder={targetIsListCollectorFolder}
              />
            );
          }}
        </Query>
      )}
      {selectingFolders && (
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
            const sectionsToDisplay = [];

            // Removes list collector folders from sections containing selectable folders when importing into a repeating section
            if (isInsideRepeatingSection()) {
              sections.forEach((section) => {
                const foldersWithoutListCollectors = section.folders.filter(
                  (folder) => folder.listId == null
                );
                sectionsToDisplay.push({
                  ...section,
                  folders: foldersWithoutListCollectors,
                });
              });
            } else {
              sectionsToDisplay.push(...sections);
            }

            return (
              <FolderPicker
                title="Select the folder(s) to import"
                isOpen={selectingFolders}
                sections={sectionsToDisplay}
                startingSelectedFolders={foldersToImport}
                warningMessage={
                  isInsideRepeatingSection()
                    ? "You cannot import list collector folders into a repeating section"
                    : ""
                }
                showSearch
                onClose={onGlobalCancel}
                onCancel={onFolderPickerCancel}
                onSubmit={onFolderPickerSubmit}
              />
            );
          }}
        </Query>
      )}
      {reviewingFolders && (
        <ReviewFoldersModal
          isOpen={reviewingFolders}
          questionnaire={questionnaireImportingFrom}
          startingSelectedFolders={foldersToImport}
          onCancel={onGlobalCancel}
          onConfirm={onReviewFoldersSubmit}
          onBack={onBackFromReviewingFolders}
          onSelectQuestions={onSelectQuestions}
          onSelectFolders={onSelectFolders}
          onSelectSections={onSelectSections}
          onRemoveAll={onRemoveAllSelectedContent}
          onRemoveSingle={onRemoveSingleSelectedContent}
        />
      )}
      {reviewingSections && (
        <ReviewSectionsModal
          isOpen={reviewingSections}
          questionnaire={questionnaireImportingFrom}
          startingSelectedSections={sectionsToImport}
          onCancel={onGlobalCancel}
          onConfirm={onReviewSectionsSubmit}
          onBack={onBackFromReviewingSections}
          onSelectQuestions={onSelectQuestions}
          onSelectFolders={onSelectFolders}
          onSelectSections={onSelectSections}
          onRemoveAll={onRemoveAllSelectedContent}
          onRemoveSingle={onRemoveSingleSelectedContent}
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
                showSearch
                onClose={onGlobalCancel}
                onCancel={onSectionPickerCancel}
                onSubmit={onSectionPickerSubmit}
              />
            );
          }}
        </Query>
      )}
      {showQuestionExtraSpaceModal && (
        <ExtraSpaceModalWrapper>
          <ExtraSpaceConfirmationModal
            title="Confirm the removal of extra spaces from selected content"
            warningMessage="By cancelling, the content will not be imported"
            isOpen={showQuestionExtraSpaceModal}
            onConfirm={() => onReviewQuestionsSubmit(questionsToImport)}
            onClose={onGlobalCancel}
          >
            <p>
              The selected content contains extra spaces at the start of lines
              of text, between words, or at the end of lines of text.
            </p>
            <p>
              Extra spaces need to be removed before this content can be
              imported.
            </p>
          </ExtraSpaceConfirmationModal>
        </ExtraSpaceModalWrapper>
      )}
      {showFolderExtraSpaceModal && (
        <ExtraSpaceModalWrapper>
          <ExtraSpaceConfirmationModal
            title="Confirm the removal of extra spaces from selected content"
            warningMessage="By cancelling, the content will not be imported"
            isOpen={showFolderExtraSpaceModal}
            onConfirm={() => onReviewFoldersSubmit(foldersToImport)}
            onClose={onGlobalCancel}
          >
            <p>
              The selected content contains extra spaces at the start of lines
              of text, between words, or at the end of lines of text.
            </p>
            <p>
              Extra spaces need to be removed before this content can be
              imported.
            </p>
          </ExtraSpaceConfirmationModal>
        </ExtraSpaceModalWrapper>
      )}
      {showSectionExtraSpaceModal && (
        <ExtraSpaceModalWrapper>
          <ExtraSpaceConfirmationModal
            title="Confirm the removal of extra spaces from selected content"
            warningMessage="By cancelling, the content will not be imported"
            isOpen={showSectionExtraSpaceModal}
            onConfirm={() => onReviewSectionsSubmit(sectionsToImport)}
            onClose={onGlobalCancel}
          >
            <p>
              The selected content contains extra spaces at the start of lines
              of text, between words, or at the end of lines of text.
            </p>
            <p>
              Extra spaces need to be removed before this content can be
              imported.
            </p>
          </ExtraSpaceConfirmationModal>
        </ExtraSpaceModalWrapper>
      )}
    </>
  );
};

ImportingContent.propTypes = {
  stopImporting: PropTypes.func.isRequired,
  targetInsideFolder: PropTypes.bool,
  targetIsListCollectorFolder: PropTypes.bool,
};

export default ImportingContent;
