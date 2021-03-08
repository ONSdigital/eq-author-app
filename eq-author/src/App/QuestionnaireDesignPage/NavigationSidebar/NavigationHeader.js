import React, { useState } from "react";
import PropTypes from "prop-types";
import { withRouter, useParams } from "react-router-dom";
import gql from "graphql-tag";
import { flowRight } from "lodash";
import { useNavigationCallbacks } from "components/NavigationCallbacks";

import { useQuestionnaire } from "components/QuestionnaireContext";

import { getPageById, getFolderById } from "utils/questionnaireUtils";

import { SECTION, FOLDER, PAGE, INTRODUCTION } from "constants/entities";

import QuestionnaireSettingsModal from "App/QuestionnaireSettingsModal";
import AddMenu from "./AddMenu/AddMenu";

import withCreateSection from "enhancers/withCreateSection";
import withCreateQuestionConfirmation from "../withCreateQuestionConfirmation";

import { QuestionPage } from "constants/page-types";

export const UnwrappedNavigationHeader = ({
  onCreateQuestionConfirmation,
  onAddSection, // TODO - Sections go to the wrong place when you're on a folder
}) => {
  const [openMenu, setOpenMenu] = useState(false);
  const { entityName, entityId } = useParams();
  const { questionnaire } = useQuestionnaire();
  const {
    onAddQuestionPage,
    onAddFolder,
    onAddCalculatedSummaryPage,
  } = useNavigationCallbacks();

  const canAddQuestionAndCalculatedSummmaryPages = () =>
    [PAGE, FOLDER, SECTION].includes(entityName);

  const canAddQuestionConfirmation = () => {
    if (entityName !== PAGE) {
      return false;
    }
    const page = getPageById(questionnaire, entityId);

    return !(!page || page.pageType !== QuestionPage || page.confirmation);
  };

  const onAddQuestionConfirmation = () =>
    onCreateQuestionConfirmation(entityId);

  const handleAddQuestionPage = (createInsideFolder = null) => {
    onAddQuestionPage(createInsideFolder);
    setOpenMenu(!openMenu);
  };

  const handleAddSection = () => {
    onAddSection();
    setOpenMenu(!openMenu);
  };

  const handleAddQuestionConfirmation = () => {
    onAddQuestionConfirmation();
    setOpenMenu(!openMenu);
  };

  const handleAddCalculatedSummaryPage = (createInsideFolder = null) => {
    onAddCalculatedSummaryPage(createInsideFolder);
    setOpenMenu(!openMenu);
  };

  const handleAddFolder = () => {
    onAddFolder();
    setOpenMenu(!openMenu);
  };

  const isFolder = entityName === FOLDER;

  return (
    <AddMenu
      data-test="add-menu"
      addMenuOpen={openMenu}
      onAddMenuToggle={() => setOpenMenu(!openMenu)}
      onAddQuestionPage={handleAddQuestionPage}
      onAddCalculatedSummaryPage={handleAddCalculatedSummaryPage}
      onAddSection={handleAddSection}
      onAddQuestionConfirmation={handleAddQuestionConfirmation}
      onAddFolder={handleAddFolder}
      canAddQuestionPage={canAddQuestionAndCalculatedSummmaryPages()}
      canAddCalculatedSummaryPage={canAddQuestionAndCalculatedSummmaryPages()}
      canAddQuestionConfirmation={canAddQuestionConfirmation()}
      canAddFolder={![INTRODUCTION].includes(entityName)}
      isFolder={isFolder}
      folderTitle={isFolder && getFolderById(questionnaire, entityId).alias}
    />
  );
};

UnwrappedNavigationHeader.propTypes = {
  onAddSection: PropTypes.func.isRequired,
  onCreateQuestionConfirmation: PropTypes.func.isRequired,
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
])(UnwrappedNavigationHeader);

export default withRouter(WrappedHeader);
