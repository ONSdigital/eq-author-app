import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import gql from "graphql-tag";

import QuestionnaireSettingsModal from "App/QuestionnaireSettingsModal";

import AddMenu from "./AddMenu";

const StyledAddMenu = styled(AddMenu)`
  width: 100%;
  margin-bottom: 0.5em;
`;

export const UnwrappedNavigationHeader = ({
  onAddQuestionPage,
  onAddSection,
  onAddQuestionConfirmation,
  onAddCalculatedSummaryPage,
  canAddQuestionPage,
  canAddCalculatedSummaryPage,
  canAddQuestionConfirmation,
  canAddFolder,
  onAddFolder,
}) => {
  const [addContentMenuState, setAddContentMenuState] = useState(false);

  const toggleAddContentMenu = () =>
    setAddContentMenuState(!addContentMenuState);

  const handleAddQuestionPage = () => {
    onAddQuestionPage();
    toggleAddContentMenu();
  };

  const handleAddSection = () => {
    onAddSection();
    toggleAddContentMenu();
  };

  const handleAddQuestionConfirmation = () => {
    onAddQuestionConfirmation();
    toggleAddContentMenu();
  };

  const handleAddCalculatedSummaryPage = () => {
    onAddCalculatedSummaryPage();
    toggleAddContentMenu();
  };

  const handleAddFolder = () => {
    onAddFolder();
    toggleAddContentMenu();
  };

  return (
    <StyledAddMenu
      addMenuOpen={addContentMenuState}
      onAddMenuToggle={toggleAddContentMenu}
      onAddQuestionPage={handleAddQuestionPage}
      canAddQuestionPage={canAddQuestionPage}
      onAddCalculatedSummaryPage={handleAddCalculatedSummaryPage}
      canAddCalculatedSummaryPage={canAddCalculatedSummaryPage}
      onAddSection={handleAddSection}
      onAddQuestionConfirmation={handleAddQuestionConfirmation}
      canAddQuestionConfirmation={canAddQuestionConfirmation}
      onAddFolder={handleAddFolder}
      canAddFolder={canAddFolder}
      data-test="add-menu"
    />
  );
};

UnwrappedNavigationHeader.propTypes = {
  onAddQuestionPage: PropTypes.func.isRequired,
  canAddQuestionPage: PropTypes.bool.isRequired,
  onAddSection: PropTypes.func.isRequired,
  onAddQuestionConfirmation: PropTypes.func.isRequired,
  canAddQuestionConfirmation: PropTypes.bool.isRequired,
  onAddCalculatedSummaryPage: PropTypes.func.isRequired,
  canAddCalculatedSummaryPage: PropTypes.bool.isRequired,
  canAddFolder: PropTypes.bool.isRequired,
  onAddFolder: PropTypes.func.isRequired,
};

UnwrappedNavigationHeader.fragments = {
  NavigationHeader: gql`
    fragment NavigationHeader on Questionnaire {
      ...QuestionnaireSettingsModal
    }

    ${QuestionnaireSettingsModal.fragments.QuestionnaireSettingsModal}
  `,
};

export default withRouter(UnwrappedNavigationHeader);
