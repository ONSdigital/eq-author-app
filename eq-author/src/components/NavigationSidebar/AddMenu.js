import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";
import Button from "components/Button";
import Popout from "components/Popout";
import IconPlus from "./icon-plus.svg?inline";
import IconText from "../IconText";

import PopupTransition from "./PopupTransition";

const AddMenuWindow = styled.div`
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
    top: 0;
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
  small: true
})`
  top: 1px; /* adjust for misalignment caused by PopoutContainer */
`;

const AddMenu = ({
  addMenuOpen,
  onAddMenuToggle,
  onAddPage,
  onAddSection,
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
        offsetX="4.9em"
        offsetY="-2.8em"
        transition={PopupTransition}
      >
        <AddMenuWindow data-test="addmenu-window">
          <AddMenuButton
            primary
            onClick={onAddPage}
            data-test="btn-add-question-page"
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
  onAddPage: PropTypes.func.isRequired,
  onAddSection: PropTypes.func.isRequired,
  onAddQuestionConfirmation: PropTypes.func.isRequired,
  canAddQuestionConfirmation: PropTypes.bool.isRequired,
  addMenuOpen: PropTypes.bool.isRequired
};

export default AddMenu;
