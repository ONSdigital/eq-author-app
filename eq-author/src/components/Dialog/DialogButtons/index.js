import React from "react";
import styled from "styled-components";
import Button from "components/Button/index";
import ButtonGroup from "components/ButtonGroup/index";
import PropTypes from "prop-types";

const StyledButtonGroup = styled(ButtonGroup)`
  display: flex;
  flex-direction: row-reverse;
  padding-top: 2em;
`;

const ActionButton = styled(Button)`
  &:not(:first-child) {
    margin-right: 1em;
  }
`;

const DialogActionButtons = props => {
  const {
    primaryAction,
    primaryActionText,
    secondaryAction,
    secondaryActionText,
    tertiaryAction,
    tertiaryActionText
  } = props;

  return (
    <StyledButtonGroup>
      <ActionButton primary onClick={primaryAction} autoFocus>
        {primaryActionText}
      </ActionButton>
      {secondaryAction && (
        <ActionButton secondary onClick={secondaryAction}>
          {secondaryActionText}
        </ActionButton>
      )}
      {tertiaryAction && (
        <ActionButton tertiary onClick={tertiaryAction}>
          {tertiaryActionText}
        </ActionButton>
      )}
    </StyledButtonGroup>
  );
};

DialogActionButtons.propTypes = {
  primaryAction: PropTypes.func.isRequired,
  primaryActionText: PropTypes.string.isRequired,
  secondaryAction: PropTypes.func,
  secondaryActionText: PropTypes.string,
  tertiaryAction: PropTypes.func,
  tertiaryActionText: PropTypes.string
};

export default DialogActionButtons;
