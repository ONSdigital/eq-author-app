import React from "react";

import styled from "styled-components";

import Modal from "components/Modal";
import DialogHeader from "components/Dialog/DialogHeader";
import DialogIcon from "components/Dialog/DialogIcon";
import {
  Message,
  Heading,
  Subheading,
  Description
} from "components/Dialog/DialogMessage";
import Button from "components/Button/index";
import ButtonGroup from "components/ButtonGroup/index";

import PropTypes from "prop-types";

import iconAlert from "./icon-alert.svg";

const DeleteConfirmModalDialog = styled(Modal)`
  .Modal {
    width: 28em;
  }
`;

const Alert = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8em;
  margin-bottom: 1em;

  &::before {
    content: url(${iconAlert});
    display: inline-block;
    margin: 0 0.5em 0 0;
  }
`;

const DeleteConfirmDialog = ({
  title,
  onDelete,
  onClose,
  alertText,
  icon,
  ...otherProps
}) => (
  <DeleteConfirmModalDialog
    onClose={onClose}
    {...otherProps}
    data={{ test: "delete-confirm-modal" }}
  >
    <DialogHeader>
      <Message>
        <Heading>Delete</Heading>
        <Subheading>{title}</Subheading>
        <Description>
          <Alert>{alertText}</Alert>
        </Description>
      </Message>
      <DialogIcon icon={icon} />
    </DialogHeader>
    <ButtonGroup horizontal align="right">
      <Button
        variant="secondary"
        onClick={onClose}
        data-test="btn-cancel-modal"
      >
        Cancel
      </Button>
      <Button
        variant="primary"
        autoFocus
        onClick={onDelete}
        data-test="btn-delete-modal"
      >
        Delete
      </Button>
    </ButtonGroup>
  </DeleteConfirmModalDialog>
);

DeleteConfirmDialog.propTypes = {
  title: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  alertText: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

export default DeleteConfirmDialog;
