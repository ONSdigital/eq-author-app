import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styled, { ThemeProvider } from "styled-components";
import FocusTrap from "focus-trap-react";

import { colors, themes } from "constants/theme.js";
import Theme from "contexts/themeContext";

import Button from "components-themed/buttons";
import Panel from "components-themed/panels";

const ModalBackground = styled.div`
  position: fixed;
  z-index: 20; /* z-index of 20 as Add / import content button has z-index of 15 */
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: ${({ theme }) => theme.colors.modalBackground};
  opacity: 0.7;
`;

const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.modalContainer};
  padding: 0px 15px 20px 20px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 30em;
  z-index: 20; /* z-index of 20 as Add / import content button has z-index of 15 */
  position: fixed;
`;

const CloseButton = styled.button`
  color: ${({ theme }) => theme.colors.text};
  float: right;
  font-size: 32px;
  /* Removes default button styling */
  cursor: pointer;
  border: none;
  background: none;
  margin: 0;
  padding: 0;
`;

const WarningText = styled.span`
  margin-top: 1.3em;
`;

const Title = styled.h2`
  margin-bottom: 0.1em;
`;

const Subtitle = styled.h3`
  color: ${({ theme }) => theme.colors.modalSubtitle};
  margin-bottom: 0.1em;
  margin-left: 0.12em;
`;

const StyledButton = styled(Button)`
  margin-top: 3em;
  margin-right: ${(props) => props.margin && `0.5em`};
`;

const Modal = ({
  title,
  subtitle,
  warningMessage,
  positiveButtonText,
  negativeButtonText,
  isOpen,
  onConfirm,
  onClose,
}) => {
  // https://stackoverflow.com/questions/63074577/close-modal-popup-using-esc-key-on-keyboard
  useEffect(() => {
    const close = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  });

  // TODO: ThemeProvider used instead of Theme wrapper
  return (
    isOpen && (
      <ThemeProvider theme={themes.ons}>
        <ModalBackground onClick={onClose} />
        <FocusTrap>
          <ModalContainer>
            <CloseButton tabIndex={0} onClick={onClose}>
              &times;
            </CloseButton>
            <Title>{title}</Title>
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
            {warningMessage && (
              <Panel withPanelMargin={false} variant="warning">
                <WarningText>{warningMessage}</WarningText>
              </Panel>
            )}
            <StyledButton
              variant="primary"
              margin
              autofocus
              onClick={onConfirm}
            >
              {positiveButtonText}
            </StyledButton>
            <StyledButton variant="secondary" onClick={onClose}>
              {negativeButtonText}
            </StyledButton>
          </ModalContainer>
        </FocusTrap>
      </ThemeProvider>
    )
  );
};

Modal.PropTypes = {
  /**
   * Text displayed as the modal's title.
   */
  title: PropTypes.string,
  /**
   * The warning message displayed on the icon - if no message is provided, warning icon is not rendered.
   */
  warningMessage: PropTypes.string,
  /**
   * The text displayed in the green positive action button.
   */
  positiveButtonText: PropTypes.string,
  /**
   * The text displayed in the grey negative action button.
   */
  negativeButtonText: PropTypes.string,
  /**
   * If true, the modal is displayed on screen.
   */
  isOpen: PropTypes.bool,
  /**
   * Function for the modal's positive action.
   */
  onConfirm: PropTypes.func,
  /**
   * Function to close the modal.
   */
  onClose: PropTypes.func,
};

Modal.defaultProps = {
  positiveButtonText: "Confirm",
  negativeButtonText: "Cancel",
};

export default Modal;
