import React from "react";
import PropTypes, { element } from "prop-types";
import styled from "styled-components";

import Popout, { Container, Layer } from "components/Popout";

import IconSection from "assets/icon-section.svg?inline";
import IconQuestion from "assets/icon-questionpage.svg?inline";
import IconSummary from "assets/icon-summarypage.svg?inline";
import IconConfirmation from "assets/icon-playback.svg?inline";
import IconFolder from "assets/icon-folder.svg?inline";
import IconImport from "assets/icon-import.svg?inline";

import PopupTransition from "../PopupTransition";
import { MenuButton, MenuAddButton } from "./AddMenuButtons";
import { FolderAddSubMenu } from "./FolderSubMenu";

import { colors } from "constants/theme";

import hotkeys from "hotkeys-js";

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

const idList = [
  { id: "mainnavutilitybtns", active: false },
  { id: "SuperNav-2", active: false },
  { id: "SuperNav-3", active: false },
  // { id: "SuperNav-4", active: false },
  // { id: "SuperNav-5", active: false },
];

hotkeys("f6", function (event) {
  event.preventDefault();

  let currentElement;

  idList.forEach((element) => {
    if (element.active) {
      currentElement = element;
      return;
    }
  });

  if (currentElement === undefined) {
    idList[0].active = true;
    currentElement = idList[0];
    document.getElementById(idList[0].id).focus();
  } else if (idList[idList.length - 1].active) {
    idList[idList.length - 1].active = false;
    idList[0].active = true;
    document.getElementById(idList[0].id).focus();
  } else {
    const currentElementIndex = idList.indexOf(currentElement);
    idList.find((element) => element.id === currentElement.id).active = false;
    idList[currentElementIndex + 1].active = true;
    currentElement = idList[currentElementIndex + 1];
    document.getElementById(idList[currentElementIndex + 1].id).focus();
  }
});

hotkeys("f7", function (event) {
  event.preventDefault();

  let currentElement;

  idList.forEach((element) => {
    if (element.active) {
      currentElement = element;
      return;
    }
  });

  if (currentElement === undefined) {
    idList[idList.length - 1].active = true;
    currentElement = idList[idList.length - 1];
    document.getElementById(idList[idList.length - 1].id).focus();
  } else if (idList[0].active) {
    idList[0].active = false;
    idList[idList.length - 1].active = true;
    document.getElementById(idList[idList.length - 1].id).focus();
  } else {
    const currentElementIndex = idList.indexOf(currentElement);
    idList.find((element) => element.id === currentElement.id).active = false;
    idList[currentElementIndex - 1].active = true;
    currentElement = idList[currentElementIndex - 1];
    document.getElementById(idList[currentElementIndex - 1].id).focus();
  }
});

// hotkeys("f5", function (event) {
//   event.preventDefault();

//   document.getElementById("mainnavutilitybtns").focus();

//   // window.location = "#mainNavFocus";
//   // document.getElementById("SuperNav-1").focus();
// });

// hotkeys("f6", function (event) {
//   event.preventDefault();

//   document.getElementById("SuperNav-2").focus();
// });

// hotkeys("f7", function (event) {
//   event.preventDefault();

//   document.getElementById("SuperNav-3").focus();
// });

const AddMenu = ({
  addMenuOpen,
  onAddMenuToggle,
  onAddQuestionPage,
  canAddQuestionPage,
  onAddSection,
  onStartImportingContent,
  canAddSection,
  onAddCalculatedSummaryPage,
  canAddCalculatedSummaryPage,
  onAddQuestionConfirmation,
  canAddQuestionConfirmation,
  canImportContent,
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
      disabled: !canAddSection,
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
    {
      handleClick: () => onStartImportingContent(false),
      disabled: !canImportContent,
      dataTest: "btn-import-content",
      icon: IconImport,
      text: "Import content",
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
              {
                handleClick: () => onStartImportingContent(true),
                disabled: !canImportContent,
                dataTest: "btn-import-content",
                icon: IconImport,
                text: "Import content",
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
  canAddSection: PropTypes.bool.isRequired,
  onAddQuestionConfirmation: PropTypes.func.isRequired,
  canAddQuestionConfirmation: PropTypes.bool.isRequired,
  onAddCalculatedSummaryPage: PropTypes.func.isRequired,
  canAddCalculatedSummaryPage: PropTypes.bool.isRequired,
  addMenuOpen: PropTypes.bool.isRequired,
  onAddFolder: PropTypes.func.isRequired,
  canAddFolder: PropTypes.bool.isRequired,
  isFolder: PropTypes.bool.isRequired,
  folderTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  canImportContent: PropTypes.bool,
  onStartImportingContent: PropTypes.func.isRequired,
};

export default AddMenu;
