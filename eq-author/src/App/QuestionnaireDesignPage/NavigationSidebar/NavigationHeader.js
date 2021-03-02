import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import gql from "graphql-tag";
import { flowRight } from "lodash";

import { withRouter, useParams } from "react-router-dom";
import {
  useCreateFolder,
  useCreatePageWithFolder,
} from "hooks/useCreateFolder";

import { useQuestionnaire } from "components/QuestionnaireContext";

import {
  useCreateQuestionPage,
  useCreateCalculatedSummaryPage,
} from "hooks/useCreateQuestionPage";

import {
  getFolders,
  getPageById,
  getFolderById,
  getFolderByPageId,
  getSectionByFolderId,
  getSectionByPageId,
  getPageByConfirmationId,
} from "utils/questionnaireUtils";

import { colors } from "constants/theme";
import {
  SECTION,
  FOLDER,
  PAGE,
  QUESTION_CONFIRMATION,
  INTRODUCTION,
} from "constants/entities";

import QuestionnaireSettingsModal from "App/QuestionnaireSettingsModal";
import AddMenu from "./AddMenu/AddMenu";

import withCreateSection from "enhancers/withCreateSection";
import withCreateQuestionConfirmation from "../withCreateQuestionConfirmation";

const QuestionPage = "QuestionPage";
const StyledAddMenu = styled(AddMenu)`
  width: 100%;
`;

export const UnwrappedNavigationHeader = ({
  onAddSection,
  onCreateQuestionConfirmation,
}) => {
  // TODO tidy this up
  const [addContentMenuState, setAddContentMenuState] = useState(false);
  const { entityName, entityId } = useParams();
  const { questionnaire } = useQuestionnaire();
  const addQuestionPage = useCreateQuestionPage();
  const addCalculatedSummaryPage = useCreateCalculatedSummaryPage();
  const addFolder = useCreateFolder();
  const addFolderWithPage = useCreatePageWithFolder();

  const toggleAddContentMenu = () =>
    setAddContentMenuState(!addContentMenuState);

  const canAddQuestionAndCalculatedSummmaryPages = () =>
    [PAGE, FOLDER, SECTION].includes(entityName);

  const canAddQuestionConfirmation = () => {
    if (entityName !== PAGE) {
      return false;
    }
    const page = getPageById(questionnaire, entityId);

    return !(!page || page.pageType !== QuestionPage || page.confirmation);
  };

  // TODO this needs to be looked at
  const onAddQuestionPage = (createInsideFolder) => {
    switch (entityName) {
      case SECTION:
        return addFolderWithPage({
          sectionId: entityId,
          position: 0,
        });
      case PAGE:
        return addQuestionPage({
          folderId: getFolderByPageId(questionnaire, entityId).id,
          position: getPageById(questionnaire, entityId).position + 1,
        });
      case FOLDER:
        if (createInsideFolder) {
          return addQuestionPage({
            folderId: entityId,
            position: 0,
          });
        }
        return addFolderWithPage({
          sectionId: getSectionByFolderId(questionnaire, entityId).id,
          position: getFolderById(questionnaire, entityId).position + 1,
        });
      default:
        break;
    }
  };

  const onAddCalculatedSummaryPage = (createInsideFolder) => {
    switch (entityName) {
      case SECTION:
        return addFolderWithPage({
          sectionId: entityId,
          position: getFolders(questionnaire).length + 1,
          isCalcSum: true,
        });
      case PAGE:
        return addCalculatedSummaryPage({
          folderId: getFolderByPageId(questionnaire, entityId).id,
          position: getPageById(questionnaire, entityId).position + 1,
        });
      case FOLDER:
        if (createInsideFolder) {
          return addCalculatedSummaryPage({
            folderId: entityId,
            position: getFolderById(questionnaire, entityId).pages.length + 1,
          });
        }
        return addFolderWithPage({
          sectionId: getSectionByFolderId(questionnaire, entityId).id,
          position: getFolderById(questionnaire, entityId).position + 1,
          isCalcSum: true,
        });
      default:
        break;
    }
  };

  const onAddFolder = () => {
    let page, params;

    switch (entityName) {
      case SECTION:
        params = { sectionId: entityId, position: 0, enabled: true };
        break;
      case FOLDER:
        params = {
          sectionId: getSectionByFolderId(questionnaire, entityId).id,
          position: getFolderById(questionnaire, entityId).position + 1,
          enabled: true,
        };
        break;
      case PAGE:
        params = {
          sectionId: getSectionByPageId(questionnaire, entityId).id,
          position: getFolderByPageId(questionnaire, entityId).position + 1,
          enabled: true,
        };
        break;
      case QUESTION_CONFIRMATION:
        page = getPageByConfirmationId(questionnaire, entityId);
        params = {
          sectionId: getSectionByPageId(questionnaire, page.id).id,
          position: getFolderByPageId(questionnaire, page.id).position + 1,
          enabled: true,
        };
        break;
      default:
        throw new Error(
          `Adding a folder when focused on entity ${entityName} with ID ${entityId} is not supported.`
        );
    }
    addFolder(params);
  };

  // TODO
  const onAddQuestionConfirmation = () => {
    onCreateQuestionConfirmation(entityId);
  };

  const handleAddQuestionPage = (createInsideFolder = null) => {
    onAddQuestionPage(createInsideFolder);
    toggleAddContentMenu();
  };

  // TODO add cb to see if this helps renders?
  const handleAddSection = () => {
    onAddSection();
    toggleAddContentMenu();
  };

  // TODO add cb to see if this helps renders?
  const handleAddQuestionConfirmation = () => {
    onAddQuestionConfirmation();
    toggleAddContentMenu();
  };

  // TODO add cb to see if this helps renders?
  const handleAddCalculatedSummaryPage = (createInsideFolder = null) => {
    onAddCalculatedSummaryPage(createInsideFolder);
    toggleAddContentMenu();
  };

  // TODO add cb to see if this helps renders?
  const handleAddFolder = () => {
    onAddFolder();
    toggleAddContentMenu();
  };

  return (
    <StyledAddMenu
      data-test="add-menu"
      addMenuOpen={addContentMenuState}
      onAddMenuToggle={toggleAddContentMenu}
      onAddQuestionPage={handleAddQuestionPage}
      canAddQuestionPage={canAddQuestionAndCalculatedSummmaryPages()}
      onAddCalculatedSummaryPage={handleAddCalculatedSummaryPage}
      canAddCalculatedSummaryPage={canAddQuestionAndCalculatedSummmaryPages()}
      onAddSection={handleAddSection}
      onAddQuestionConfirmation={handleAddQuestionConfirmation}
      canAddQuestionConfirmation={canAddQuestionConfirmation()}
      onAddFolder={handleAddFolder}
      canAddFolder={![INTRODUCTION].includes(entityName)}
      isFolder={entityName === FOLDER}
    />
  );
};

UnwrappedNavigationHeader.propTypes = {
  onAddSection: PropTypes.func.isRequired,
  onCreateQuestionConfirmation: PropTypes.func.isRequired,
  // questionnaire: PropTypes.object.isRequired,
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
