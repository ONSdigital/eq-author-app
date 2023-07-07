import React, { useState } from "react";
import { withRouter, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import gql from "graphql-tag";

import { flowRight } from "lodash";
import { getPageById, getFolderById } from "utils/questionnaireUtils";
import { SECTION, FOLDER, PAGE, INTRODUCTION } from "constants/entities";

import QuestionnaireSettingsModal from "App/QuestionnaireSettingsModal";
import ImportingContent from "App/importingContent";

import { useNavigationCallbacks } from "components/NavigationCallbacks";
import { useQuestionnaire } from "components/QuestionnaireContext";
import AddMenu from "../AddMenu/AddMenu";

import withCreateSection from "enhancers/withCreateSection";
import withCreateQuestionConfirmation from "../../withCreateQuestionConfirmation";
import withCreateIntroductionPage from "../../withCreateIntroductionPage";

import { QuestionPage } from "constants/page-types";

import isListCollectorPageType from "utils/isListCollectorPageType";

export const UnwrappedNavigationHeader = ({
  onCreateQuestionConfirmation,
  onAddSection,
  onAddIntroductionPage,
}) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [importingContent, setImportingContent] = useState(false);
  const [targetInsideFolder, setTargetInsideFolder] = useState(false);

  const { entityName, entityId } = useParams();
  const { questionnaire } = useQuestionnaire();
  const {
    onAddQuestionPage,
    onAddFolder,
    onAddCalculatedSummaryPage,
    onAddListCollectorFolder,
  } = useNavigationCallbacks();

  const page = getPageById(questionnaire, entityId);
  const folder = getFolderById(questionnaire, entityId);
  const isFolder = entityName === FOLDER;
  const isListCollectorFolder = folder && folder?.listId !== undefined;

  const canAddQuestionAndCalculatedSummmaryPages =
    ([PAGE, SECTION].includes(entityName) &&
      !isListCollectorPageType(page?.pageType)) ||
    isFolder;

  const canAddFolder = [PAGE, FOLDER, SECTION].includes(entityName);

  const canAddSection = [PAGE, FOLDER, SECTION, INTRODUCTION].includes(
    entityName
  );

  let canAddQuestionConfirmation = false;
  if (entityName === PAGE) {
    canAddQuestionConfirmation =
      page?.pageType === QuestionPage && !page?.confirmation;
  }

  const canAddIntroductionPage =
    !questionnaire?.introduction &&
    [PAGE, FOLDER, SECTION].includes(entityName);

  const canImportContent = [PAGE, FOLDER, SECTION].includes(entityName);

  const handleAddQuestionPage = (createInsideFolder) => {
    setOpenMenu(!openMenu);
    onAddQuestionPage(createInsideFolder);
  };

  const handleAddSection = () => {
    onAddSection();
    setOpenMenu(!openMenu);
  };

  const handleAddQuestionConfirmation = () => {
    onCreateQuestionConfirmation(entityId);
    setOpenMenu(!openMenu);
  };

  const handleAddIntroductionPage = () => {
    onAddIntroductionPage();
    setOpenMenu(!openMenu);
  };

  const handleAddCalculatedSummaryPage = (createInsideFolder) => {
    onAddCalculatedSummaryPage(createInsideFolder);
    setOpenMenu(!openMenu);
  };

  const handleAddListCollectorFolder = () => {
    onAddListCollectorFolder();
    setOpenMenu(!openMenu);
  };

  const handleAddFolder = () => {
    onAddFolder();
    setOpenMenu(!openMenu);
  };

  const handleStartImportingContent = (targetInsideFolder) => {
    setTargetInsideFolder(targetInsideFolder);
    setImportingContent(true);
    setOpenMenu(!openMenu);
  };

  const getQuestionnaires = () => {};

  return (
    <>
      <AddMenu
        data-test="add-menu"
        addMenuOpen={openMenu}
        onAddMenuToggle={() => setOpenMenu(!openMenu)}
        onAddQuestionPage={handleAddQuestionPage}
        onAddCalculatedSummaryPage={handleAddCalculatedSummaryPage}
        onAddSection={handleAddSection}
        onAddQuestionConfirmation={handleAddQuestionConfirmation}
        onAddFolder={handleAddFolder}
        onAddListCollectorFolder={handleAddListCollectorFolder}
        onAddIntroductionPage={handleAddIntroductionPage}
        onStartImportingContent={handleStartImportingContent}
        canAddQuestionPage={canAddQuestionAndCalculatedSummmaryPages}
        canAddCalculatedSummaryPage={canAddQuestionAndCalculatedSummmaryPages}
        canAddQuestionConfirmation={canAddQuestionConfirmation}
        canAddListCollectorFolder={canAddFolder}
        canAddIntroductionPage={canAddIntroductionPage}
        canAddFolder={canAddFolder}
        canAddSection={canAddSection}
        canImportContent={canImportContent}
        isFolder={isFolder}
        isListCollectorFolder={isListCollectorFolder}
        folderTitle={isFolder && getFolderById(questionnaire, entityId)?.alias}
      />
      {importingContent && (
        <ImportingContent
          questionnaires={getQuestionnaires()}
          stopImporting={() => setImportingContent(false)}
          targetInsideFolder={targetInsideFolder}
        />
      )}
    </>
  );
};

UnwrappedNavigationHeader.propTypes = {
  onAddSection: PropTypes.func.isRequired,
  onCreateQuestionConfirmation: PropTypes.func.isRequired,
  onAddIntroductionPage: PropTypes.func.isRequired,
};

UnwrappedNavigationHeader.fragments = {
  NavigationHeader: gql`
    fragment NavigationHeader on Questionnaire {
      ...QuestionnaireSettingsModal
    }

    ${QuestionnaireSettingsModal.fragments.QuestionnaireSettingsModal}
  `,
};

const WrappedHeader = flowRight([
  withCreateQuestionConfirmation,
  withCreateSection,
  withCreateIntroductionPage,
])(UnwrappedNavigationHeader);

// needed for addSection()
export default withRouter(WrappedHeader);
