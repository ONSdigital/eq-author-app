import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { colors } from "constants/theme";
import Modal from "components/modals/Modal";
import Button from "components-themed/buttons";
import PropTypes from "prop-types";
import Theme from "contexts/themeContext";

const StyledModal = styled(Modal)`
  .Modal {
    max-width: 500px;
    border-radius: 0.4rem;
    padding: 0 20px 20px 20px;
  }
`;

const Title = styled.h2`
  color: ${colors.darkGrey};
`;

const Message = styled.div``;

const StyledButtonCancel = styled(Button)`
  background-color: ${colors.grey15};
  margin-right: ${(props) => props.margin && `0.5em`};
`;

const StyledButtonConfirm = styled(Button)`
  background-color: ${colors.leafGreen};
  margin-right: ${(props) => props.margin && `0.5em`};
`;

const ButtonContainer = styled.div`
  margin-top: 1em;
  float: right;
  padding-bottom: 0.3em;
`;

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
  useEffect(() => {
    const close = (event) => {
      if (event.key === "Escape") {
        handleCancel();
      }
    };

    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  });

  return (
    <StyledModal
      isOpen={isOpen}
      onClose={handleCancel}
      data={{ test: "paste-modal" }}
    >
      <Title>Confirm the removal of extra spaces from copied content</Title>
      <Message>
        <p>
          The copied content contains extra spaces at the start of lines of
          text, between words, or at the end of lines of text.
        </p>
        <p>
          Extra spaces need to be removed before this content can be pasted.
          Confirming will remove them automatically, while cancelling will
          prevent pasting.
        </p>
      </Message>
      <Theme>
        <ButtonContainer>
          <StyledButtonCancel
            variant="secondary"
            margin
            onClick={handleCancel}
            data-test="paste-modal-cancel"
          >
            Cancel
          </StyledButtonCancel>
          <StyledButtonConfirm
            variant="primary"
            onClick={handleConfirm}
            data-test="paste-modal-confirm"
          >
            Confirm
          </StyledButtonConfirm>
        </ButtonContainer>
      </Theme>
    </StyledModal>
  );
};

export const usePasteModal = ({ action, ...props }) => {
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
        <PasteModal
          {...props}
          isOpen={isOpen}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      ),
      [props, handleCancel, handleConfirm, isOpen]
    ),
  };
};

PasteModal.propTypes = {
  isOpen: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default PasteModal;
