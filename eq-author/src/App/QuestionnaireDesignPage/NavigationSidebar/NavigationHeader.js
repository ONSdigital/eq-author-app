import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withRouter, useParams } from "react-router-dom";
import gql from "graphql-tag";
import {
  useCreateFolder,
  useCreatePageWithFolder,
} from "hooks/useCreateFolder";
import { useQuestionnaire } from "components/QuestionnaireContext";
import {
  useCreateQuestionPage,
  useCreateCalculatedSummaryPage,
} from "hooks/useCreateQuestionPage";
import { colors } from "constants/theme";
import {
  getFolders,
  getPageById,
  getFolderById,
  getFolderByPageId,
  getSectionByFolderId,
  getSectionByPageId,
  getPageByConfirmationId,
} from "utils/questionnaireUtils";
import {
  SECTION,
  FOLDER,
  PAGE,
  QUESTION_CONFIRMATION,
  INTRODUCTION,
} from "constants/entities";
import { flowRight } from "lodash";

import QuestionnaireSettingsModal from "App/QuestionnaireSettingsModal";

import withCreateSection from "enhancers/withCreateSection";
import withCreateQuestionConfirmation from "../withCreateQuestionConfirmation";

import AddMenu from "./AddMenu/AddMenu";

const QuestionPage = "QuestionPage";
const StyledAddMenu = styled(AddMenu)`
  width: 100%;
`;

const QuestionnaireContent = styled.div`
  border-bottom: solid 1px ${colors.darkGrey};
`;

export const UnwrappedNavigationHeader = ({
  onAddSection,
  onCreateQuestionConfirmation,
}) => {
  const questionnaire = useQuestionnaire();
  const addQuestionPage = useCreateQuestionPage();
  const addCalculatedSummaryPage = useCreateCalculatedSummaryPage();
  const addFolder = useCreateFolder();
  const addFolderWithPage = useCreatePageWithFolder();
  const { entityName, entityId } = useParams();
  const [addContentMenuState, setAddContentMenuState] = useState(false);

  const canAddQuestionAndCalculatedSummmaryPages = () => {
    return [PAGE, FOLDER, SECTION].includes(entityName);
  };

  const canAddQuestionConfirmation = () => {
    if (entityName !== PAGE) {
      return false;
    }

    const page = getPageById(questionnaire, entityId);

    // TODO make this constant
    return !page || page.confirmation || page.pageType !== QuestionPage;
  };

  const canAddFolder = () => {
    return ![INTRODUCTION].includes(entityName);
  };

  // keep this the exact same
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
    let position, sectionId, page;

    switch (entityName) {
      case SECTION:
        addFolder({ sectionId: entityId, position: 0, enabled: true });
        break;
      case FOLDER:
        ({ position } = getFolderById(questionnaire, entityId));
        ({ id: sectionId } = getSectionByFolderId(questionnaire, entityId));
        addFolder({ sectionId, position: position + 1, enabled: true });
        break;
      case PAGE:
        ({ position } = getFolderByPageId(questionnaire, entityId));
        ({ id: sectionId } = getSectionByPageId(questionnaire, entityId));
        addFolder({ sectionId, position: position + 1, enabled: true });
        break;
      case QUESTION_CONFIRMATION:
        page = getPageByConfirmationId(questionnaire, entityId);
        ({ position } = getFolderByPageId(questionnaire, page.id));
        ({ id: sectionId } = getSectionByPageId(questionnaire, page.id));
        addFolder({ sectionId, position: position + 1, enabled: true });
        break;
      default:
        throw new Error(
          `Adding a folder when focused on entity ${entityName} with ID ${entityId} is not supported.`
        );
    }
  };

  // TODO
  const onAddQuestionConfirmation = () => {
    onCreateQuestionConfirmation(entityId);
  };

  const toggleAddContentMenu = () =>
    setAddContentMenuState(!addContentMenuState);

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
    <>
      <QuestionnaireContent>
        <StyledAddMenu
          addMenuOpen={addContentMenuState}
          onAddMenuToggle={toggleAddContentMenu}
          onAddQuestionPage={handleAddQuestionPage}
          canAddQuestionPage={canAddQuestionAndCalculatedSummmaryPages()}
          onAddCalculatedSummaryPage={handleAddCalculatedSummaryPage}
          canAddCalculatedSummaryPage={canAddQuestionAndCalculatedSummmaryPages()}
          onAddSection={handleAddSection}
          onAddQuestionConfirmation={handleAddQuestionConfirmation}
          canAddQuestionConfirmation={canAddQuestionConfirmation}
          onAddFolder={handleAddFolder}
          canAddFolder={canAddFolder}
          data-test="add-menu"
        />
      </QuestionnaireContent>
    </>
  );
};

UnwrappedNavigationHeader.propTypes = {
  onAddQuestionPage: PropTypes.func.isRequired,
  canAddQuestionPage: PropTypes.bool.isRequired,
  onAddSection: PropTypes.func.isRequired,
  onCreateQuestionConfirmation: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  questionnaire: PropTypes.object.isRequired,
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
