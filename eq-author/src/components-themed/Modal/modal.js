import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styled, { ThemeProvider } from "styled-components";
import { darken } from "polished";
import FocusTrap from "focus-trap-react";

import { colors, themes } from "constants/theme.js";
import Theme from "contexts/themeContext";

import Button from "components-themed/buttons";
import Panel from "components-themed/panels";

const Wrapper = styled.div``;

const ModalBackground = styled.div`
  position: fixed;
  z-index: 20; /* z-index of 20 as Add / import content button has z-index of 15 */
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: ${colors.modalBackground};
  opacity: 0.7;
`;

const ModalContainer = styled.div`
  background-color: ${colors.modalContainer};
  padding: 0px 15px 20px 20px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 30em;
  z-index: 20; /* z-index of 20 as Add / import content button has z-index of 15 */
  position: fixed;
`;

const CloseButton = styled.button`
  color: ${colors.text};
  float: right;
  font-size: 32px;
  /* Removes default button styling */
  cursor: pointer;
  border: none;
  background: none;
  margin: 0;
  margin-top: 0.1rem;
  padding-right: 0.3em;
  padding-left: 0.3em;
`;

const Title = styled.h2`
  margin-bottom: 0.1em;
`;

const Subtitle = styled.h3`
  color: ${colors.modalSubtitle};
  margin-bottom: 0.1em;
  margin-left: 0.12em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const StyledButton = styled(Button)`
  margin-top: 3em;
  margin-right: ${(props) => props.margin && `0.5em`};
  /* TODO: The following styling rules can all be deleted once theme wrapper has been fixed */
  background-color: ${(props) =>
    props.variant === "primary" ? colors.onsPrimary : colors.onsSecondary};
  box-shadow: 0 3px
    ${(props) =>
      props.variant === "primary"
        ? darken(0.15, colors.onsPrimary)
        : darken(0.5, colors.onsSecondary)};
  &:hover {
    background-color: ${(props) =>
      props.variant === "primary"
        ? darken(0.1, colors.onsPrimary)
        : darken(0.1, colors.onsSecondary)};
  }
  &:focus {
    background-color: ${colors.focus};
    box-shadow: ${(props) =>
      props.variant === "secondary" &&
      `0 3px ${darken(0.15, colors.onsPrimary)}`};
  }
  &:active:focus {
    color: ${(props) => props.variant === "primary" && colors.textInverse};
    background-color: ${(props) =>
      props.variant === "primary"
        ? darken(0.1, colors.onsPrimary)
        : darken(0.1, colors.onsSecondary)};
    box-shadow: 0 0 transparent;
    top: 3px;
  }
  &:focus:hover:not(:active) {
    color: ${(props) => props.variant === "primary" && colors.text};
    background-color: ${darken(0.05, colors.focus)};
    box-shadow: ${(props) =>
      props.variant === "secondary" &&
      `0 3px ${darken(0.15, colors.onsPrimary)}`};
  }
`;

const ButtonContainer = styled.div`
  float: right;
`;

const WarningWrapper = styled.div`
  margin-top: 1.3em;
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

  // TODO: This will include the theme wrapper once theme wrapper is fixed - currently using theme wrapper causes all text to change font size
  return (
    isOpen && (
      // <Theme themeName={"ons"}>
      <FocusTrap>
        <Wrapper>
          <ModalBackground onClick={onClose} />
          <ModalContainer data-test="modal">
            <CloseButton onClick={onClose} data-test="btn-modal-close">
              &times;
            </CloseButton>
            <Title>{title}</Title>
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
            {warningMessage && (
              <WarningWrapper>
                <Panel withPanelMargin={false} variant="warning">
                  {warningMessage}
                </Panel>
              </WarningWrapper>
            )}
            <ButtonContainer>
              <StyledButton
                variant="secondary"
                margin
                onClick={onClose}
                data-test="btn-modal-negative"
              >
                {negativeButtonText}
              </StyledButton>
              <StyledButton
                variant="primary"
                onClick={onConfirm}
                data-test="btn-modal-positive"
              >
                {positiveButtonText}
              </StyledButton>
            </ButtonContainer>
          </ModalContainer>
        </Wrapper>
      </FocusTrap>
      // </Theme>
    )
  );
};

Modal.propTypes = {
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
