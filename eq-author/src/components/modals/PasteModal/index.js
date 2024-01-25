import React from "react";
import styled from "styled-components";
import Modal from "components-themed/Modal";
import PropTypes from "prop-types";

const Message = styled.div``;

export const preserveRichFormatting = (text) => {
  // Replace multiple spaces and tabs with a single space
  let formattedText = text.replace(/[ \t]+/g, " ");

  // Split the text into lines
  let lines = formattedText.split(/\r?\n/);

  // Remove leading and trailing spaces from each line and join them back with newline characters
  formattedText = lines.map((line) => line.trim()).join("\n");

  return formattedText;
};

const PasteModal = ({
  isOpen = false,
  onConfirm: handleConfirm,
  onCancel: handleCancel,
}) => {
  return (
    <Modal
      title="Confirm the removal of extra spaces from copied content"
      warningMessage="By cancelling, the content will not be pasted"
      isOpen={isOpen}
      buttonMargin="1em"
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
  );
};

PasteModal.propTypes = {
  isOpen: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default PasteModal;
