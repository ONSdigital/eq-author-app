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
import AddMenu from "../AddMenu/AddMenu";

import withCreateSection from "enhancers/withCreateSection";
import withCreateQuestionConfirmation from "../../withCreateQuestionConfirmation";

import { QuestionPage } from "constants/page-types";

export const UnwrappedNavigationHeader = ({
  onCreateQuestionConfirmation,
  onAddSection,
}) => {
  const [openMenu, setOpenMenu] = useState(false);
  const { entityName, entityId } = useParams();
  const { questionnaire } = useQuestionnaire();
  const {
    onAddQuestionPage,
    onAddFolder,
    onAddCalculatedSummaryPage,
  } = useNavigationCallbacks();

  const canAddQuestionCalculatedSummmaryPagesAndFolder = [
    PAGE,
    FOLDER,
    SECTION,
  ].includes(entityName);

  const canAddSection = [PAGE, FOLDER, SECTION, INTRODUCTION].includes(
    entityName
  );

  let canAddQuestionConfirmation = false;
  if (entityName === PAGE) {
    const page = getPageById(questionnaire, entityId);
    canAddQuestionConfirmation =
      page?.pageType === QuestionPage && !page?.confirmation;
  }

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

  const handleAddCalculatedSummaryPage = (createInsideFolder) => {
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
      canAddQuestionPage={canAddQuestionCalculatedSummmaryPagesAndFolder}
      canAddCalculatedSummaryPage={
        canAddQuestionCalculatedSummmaryPagesAndFolder
      }
      canAddQuestionConfirmation={canAddQuestionConfirmation}
      canAddFolder={canAddQuestionCalculatedSummmaryPagesAndFolder}
      canAddSection={canAddSection}
      isFolder={isFolder}
      folderTitle={isFolder && getFolderById(questionnaire, entityId)?.alias}
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

// needed for addSection()
export default withRouter(WrappedHeader);
