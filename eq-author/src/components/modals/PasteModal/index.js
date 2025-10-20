import React from "react";
import styled from "styled-components";
import Modal from "components-themed/Modal";
import PropTypes from "prop-types";

const Message = styled.div``;

const ModalWrapper = styled.div`
  .modal-button-container {
    margin-top: 1em;
  }
`;

const PasteModal = ({
  isOpen = false,
  onConfirm: handleConfirm,
  onCancel: handleCancel,
}) => {
  return (
    <ModalWrapper>
      <Modal
        title="Confirm the removal of extra spaces from copied content"
        warningMessage="By cancelling, the content will not be pasted"
        isOpen={isOpen}
        onConfirm={handleConfirm}
        onClose={handleCancel}
        data={{ test: "paste-modal" }}
      >
        <Message>
          <p>
            The copied content contains extra spaces at the start of lines of
            text, between words, or at the end of lines of text.
          </p>
          <p>
            Extra spaces need to be removed before this content can be pasted.
          </p>
        </Message>
      </Modal>
    </ModalWrapper>
  );
};

PasteModal.propTypes = {
  isOpen: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default PasteModal;
