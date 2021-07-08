import React from "react";
import styled from "styled-components";
import Button from "components/buttons/Button";
import ButtonGroup from "components/buttons/ButtonGroup";
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

const DialogActionButtons = (props) => {
  const {
    primaryAction,
    primaryActionText,
    secondaryAction,
    secondaryActionText,
    tertiaryAction,
    tertiaryActionText,
    primaryEnabled = true,
    secondaryEnabled = true,
    tertiaryEnabled = true,
  } = props;

  return (
    <StyledButtonGroup>
      <ActionButton
        variant="primary"
        onClick={primaryAction}
        autoFocus
        disabled={!primaryEnabled}
      >
        {primaryActionText}
      </ActionButton>
      {secondaryAction && (
        <ActionButton
          variant="secondary"
          onClick={secondaryAction}
          disabled={!secondaryEnabled}
        >
          {secondaryActionText}
        </ActionButton>
      )}
      {tertiaryAction && (
        <ActionButton
          variant="secondary"
          onClick={tertiaryAction}
          disabled={!tertiaryEnabled}
        >
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
  tertiaryActionText: PropTypes.string,
  primaryEnabled: PropTypes.bool,
  secondaryEnabled: PropTypes.bool,
  tertiaryEnabled: PropTypes.bool,
};

export default DialogActionButtons;
