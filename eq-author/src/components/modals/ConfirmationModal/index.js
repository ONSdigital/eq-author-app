import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { colors } from "constants/theme";
import { Grid, Column } from "components/Grid";
import Modal from "components/modals/Modal";
import ButtonGroup from "components/buttons/ButtonGroup";
import Button from "components/buttons/Button";
import PropTypes from "prop-types";

import { ReactComponent as WarningIcon } from "assets/icon-warning.svg";

const Title = styled.h2`
  color: ${colors.darkGrey};
`;

const WarningText = styled.p`
  color: ${colors.red};
  font-weight: bold;
  margin: 0;
`;

const IconColumn = styled(Column).attrs({ cols: 1, gutters: false })`
  text-align: right;
  padding-right: 0.5em;
  svg {
    width: 1.5em;
    height: 1.5em;
    position: relative;
    top: 0.125em;

    ${({ greyscale }) =>
      greyscale ? `path { fill: ${colors.darkGrey}; }` : ""}
  }
`;

const TextColumn = styled(Column).attrs({ cols: 11, gutters: true })``;

const ButtonGroupStyled = styled(ButtonGroup).attrs({
  horizontal: true,
  align: "right",
})`
  padding-top: 1.5em;
`;

export const DEFAULT_CONFIRM_TEXT = "Confirm";
export const DEFAULT_CANCEL_TEXT = "Cancel";

const ConfirmationModal = ({
  icon: Icon = () => null,
  title = "Are you sure?",
  message = "Please confirm this operation.",
  confirmText = DEFAULT_CONFIRM_TEXT,
  cancelText = DEFAULT_CANCEL_TEXT,
  isOpen = false,
  onConfirm: handleConfirm,
  onCancel: handleCancel,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={handleCancel}>
      <Grid align="center">
        <IconColumn greyscale>
          <Icon />
        </IconColumn>
        <TextColumn>
          <Title>{title}</Title>
        </TextColumn>
      </Grid>
      <Grid align="center">
        <IconColumn>
          <WarningIcon />
        </IconColumn>
        <TextColumn>
          <WarningText>{message}</WarningText>
        </TextColumn>
      </Grid>
      <ButtonGroupStyled>
        <Button variant="secondary" onClick={handleCancel}>
          {cancelText}
        </Button>
        <Button variant="primary" onClick={handleConfirm} autoFocus>
          {confirmText}
        </Button>
      </ButtonGroupStyled>
    </Modal>
  );
};

export const useConfirmationModal = ({ action, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = useCallback(() => {
    action();
    setIsOpen(false);
  }, [action]);

  const handleCancel = useCallback(() => setIsOpen(false), []);

  return {
    trigger: useCallback(() => setIsOpen(true), []),
    component: useCallback(
      () => (
        <ConfirmationModal
          {...props}
          isOpen={isOpen}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      ),
      [props, action]
    ),
  };
};

ConfirmationModal.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  isOpen: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmationModal;
