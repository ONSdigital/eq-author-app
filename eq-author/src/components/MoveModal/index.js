import React from "react";
import Modal from "components/Modal";
import styled from "styled-components";
import DialogHeader from "components/Dialog/DialogHeader";
import { Message, Heading } from "components/Dialog/DialogMessage";
import PropTypes from "prop-types";
import { colors } from "constants/theme";

const StyledModal = styled(Modal)`
  .Modal {
    width: 25em;
  }
`;

const CenteredHeading = styled(Heading)`
  text-align: center;
  margin-bottom: 1rem;
  color: ${colors.text};
`;

const MoveModal = ({ title, children, isOpen, onClose }) => {
  return (
    <StyledModal
      isOpen={isOpen}
      onClose={onClose}
      data={{ test: "move-modal" }}
    >
      <DialogHeader>
        <Message>
          <CenteredHeading>{title}</CenteredHeading>
        </Message>
      </DialogHeader>
      {children}
    </StyledModal>
  );
};

MoveModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default MoveModal;
