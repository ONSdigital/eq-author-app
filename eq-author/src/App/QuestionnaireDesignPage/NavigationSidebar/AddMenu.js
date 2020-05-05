import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";
import Button from "components/buttons/Button";
import Popout from "components/Popout";
import IconPlus from "./icon-plus.svg?inline";
import IconText from "components/IconText";

import PopupTransition from "./PopupTransition";

const AddMenuWindow = styled.div`
  margin-top: 2em;
  background: white;
  padding: 0.25em;
  color: black;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.16) 0 5px 20px 0;
  display: flex;
  flex-direction: column;
  position: relative;

  &::before {
    content: "";
    width: 1em;
    height: 1em;
    background: white;
    transform: rotate(45deg);
    position: absolute;
    top: -8.3em;
    bottom: 0;
    left: -0.4em;
    margin: auto;
  }
`;

const AddMenuButton = styled(Button)`
  justify-content: left;
  font-size: 1em;
  padding: 0.5em 1em;
  margin: 0.25em;
  white-space: nowrap;
`;

const AddButton = styled(Button).attrs({
  variant: "tertiary-light",
  small: true,
})`
  border: 1px solid white;
  top: 1px; /* adjust for misalignment caused by PopoutContainer */
  padding-right: 0.5em;
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
  ...otherProps
}) => {
  const addBtn = (
    <AddButton data-test="btn-add">
      <IconText icon={IconPlus}>Add</IconText>
    </AddButton>
  );
  return (
    <div {...otherProps}>
      <Popout
        open={addMenuOpen}
        trigger={addBtn}
        onToggleOpen={onAddMenuToggle}
        horizontalAlignment="left"
        verticalAlignment="top"
        offsetX="5.5em"
        offsetY="-2em"
        transition={PopupTransition}
      >
        <AddMenuWindow data-test="addmenu-window">
          <AddMenuButton
            primary
            onClick={onAddQuestionPage}
            data-test="btn-add-question-page"
            disabled={!canAddQuestionPage}
          >
            Question page
          </AddMenuButton>
          <AddMenuButton
            primary
            data-test="btn-add-question-confirmation"
            onClick={onAddQuestionConfirmation}
            disabled={!canAddQuestionConfirmation}
          >
            Confirmation question
          </AddMenuButton>
          <AddMenuButton
            primary
            onClick={onAddCalculatedSummaryPage}
            data-test="btn-add-calculated-summary"
            disabled={!canAddCalculatedSummaryPage}
          >
            Calculated summary
          </AddMenuButton>
          <AddMenuButton
            primary
            onClick={onAddSection}
            data-test="btn-add-section"
          >
            Section
          </AddMenuButton>
        </AddMenuWindow>
      </Popout>
    </div>
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
};

export default AddMenu;
