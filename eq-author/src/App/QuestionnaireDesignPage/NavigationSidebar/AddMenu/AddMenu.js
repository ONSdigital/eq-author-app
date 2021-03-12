import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Popout, { Container, Layer } from "components/Popout";

import IconSection from "assets/icon-section.svg?inline";
import IconQuestion from "assets/icon-questionpage.svg?inline";
import IconSummary from "assets/icon-summarypage.svg?inline";
import IconConfirmation from "assets/icon-playback.svg?inline";
import IconFolder from "assets/icon-folder.svg?inline";

import PopupTransition from "../PopupTransition";
import { MenuButton, MenuAddButton } from "./AddMenuButtons";
import { FolderAddSubMenu } from "./FolderSubMenu";

import { colors } from "constants/theme";

const AddMenuWindow = styled.div`
  color: black;
  background-color: ${colors.orange};
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const PopoutContainer = styled(Container)`
  width: 100%;
  margin-bottom: 0.5em;
`;

const PopoutLayer = styled(Layer)`
  left: auto;
  top: auto;
  width: 100%;
`;

const AddMenu = ({
  addMenuOpen,
  onAddMenuToggle,
  onAddQuestionPage,
  canAddQuestionPage,
  onAddSection,
  onAddCalculatedSummaryPage,
  canAddCalculatedSummaryPage,
  onAddQuestionConfirmation,
  canAddQuestionConfirmation,
  onAddFolder,
  canAddFolder,
  isFolder,
  folderTitle,
}) => {
  const defaultButtons = [
    {
      handleClick: () => onAddQuestionPage(),
      disabled: !canAddQuestionPage,
      dataTest: "btn-add-question-page",
      icon: IconQuestion,
      text: "Question",
    },
    {
      handleClick: onAddSection,
      disabled: false,
      dataTest: "btn-add-section",
      icon: IconSection,
      text: "Section",
    },
    {
      handleClick: onAddFolder,
      disabled: !canAddFolder,
      dataTest: "btn-add-folder",
      icon: IconFolder,
      text: "Folder",
    },
    {
      handleClick: onAddQuestionConfirmation,
      disabled: !canAddQuestionConfirmation,
      dataTest: "btn-add-question-confirmation",
      icon: IconConfirmation,
      text: "Confirmation question",
    },
    {
      handleClick: () => onAddCalculatedSummaryPage(),
      disabled: !canAddCalculatedSummaryPage,
      dataTest: "btn-add-calculated-summary",
      icon: IconSummary,
      text: "Calculated summary",
    },
  ];

  return (
    <Popout
      open={addMenuOpen}
      trigger={MenuAddButton}
      onToggleOpen={onAddMenuToggle}
      horizontalAlignment="left"
      verticalAlignment="top"
      transition={PopupTransition}
      container={PopoutContainer}
      layer={PopoutLayer}
    >
      <AddMenuWindow data-test="addmenu-window">
        {isFolder && (
          <FolderAddSubMenu folderTitle={folderTitle}>
            {[
              {
                handleClick: () => onAddQuestionPage(true),
                disabled: !canAddQuestionPage,
                dataTest: "btn-add-question-page-inside",
                icon: IconQuestion,
                text: "Question",
              },
              {
                handleClick: () => onAddCalculatedSummaryPage(true),
                disabled: !canAddCalculatedSummaryPage,
                dataTest: "btn-add-calculated-summary-inside",
                icon: IconSummary,
                text: "Calculated summary",
              },
            ].map((item) => (
              <MenuButton key={`${item.dataTest}-folder`} {...item} />
            ))}
          </FolderAddSubMenu>
        )}
        {defaultButtons.map((item) => (
          <MenuButton key={item.dataTest} {...item} />
        ))}
      </AddMenuWindow>
    </Popout>
  );
};

AddMenu.propTypes = {
  onAddMenuToggle: PropTypes.func.isRequired,
  onAddQuestionPage: PropTypes.func.isRequired,
  canAddQuestionPage: PropTypes.bool.isRequired,
  onAddSection: PropTypes.func.isRequired,
  onAddQuestionConfirmation: PropTypes.func.isRequired,
  canAddQuestionConfirmation: PropTypes.bool.isRequired,
  onAddCalculatedSummaryPage: PropTypes.func.isRequired,
  canAddCalculatedSummaryPage: PropTypes.bool.isRequired,
  addMenuOpen: PropTypes.bool.isRequired,
  onAddFolder: PropTypes.func.isRequired,
  canAddFolder: PropTypes.bool.isRequired,
  isFolder: PropTypes.bool.isRequired,
  folderTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

export default AddMenu;
