import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import FocusTrap from "focus-trap-react";

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
  background-color: ${({ theme }) => theme.colors.modalBackground};
  opacity: 0.7;
`;

const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.modalContainer};
  padding: 0px 15px 20px 20px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: ${(props) => (props.warningMessage ? `30em` : `25em`)};
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
  margin-top: 0.1rem;
  padding-right: 0.3em;
  padding-left: 0.3em;
`;

const Title = styled.h2`
  margin-bottom: 0.1em;
`;

const Subtitle = styled.h3`
  color: ${({ theme }) => theme.colors.modalSubtitle};
  margin-bottom: 0.1em;
  margin-left: 0.12em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const StyledButton = styled(Button)`
  margin-top: 3em;
  margin-right: ${(props) => props.margin && `0.5em`};
`;

const ButtonContainer = styled.div`
  float: right;
  padding-bottom: 0.3em;
`;

const WarningWrapper = styled.div`
  margin-top: 1.3em;
`;

const ContentWrapper = styled.div`
  width: 26em;
`;

const Modal = ({
  title,
  subtitle,
  warningMessage,
  positiveButtonText,
  negativeButtonText,
  isOpen,
  // TODO: remove updatedFontTheme when theme container is fixed for fontSize 18px
  updatedFontTheme,
  onConfirm,
  onClose,
  children,
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

  // TODO: When theme container is fixed for fontSize 18px, themeName can be changed to "ons" for all modals
  return (
    isOpen && (
      <Theme themeName={updatedFontTheme ? "ons" : "onsLegacyFont"}>
        <FocusTrap>
          <Wrapper>
            <ModalBackground onClick={onClose} />
            <ModalContainer warningMessage={warningMessage} data-test="modal">
              <CloseButton onClick={onClose} data-test="btn-modal-close">
                &times;
              </CloseButton>
              <Title>{title}</Title>
              {subtitle && <Subtitle>{subtitle}</Subtitle>}
              <ContentWrapper>{children}</ContentWrapper>
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
      </Theme>
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
  /**
   * Temporary prop - if false, onsLegacyFont is used as the modal's theme
   */
  updatedFontTheme: PropTypes.bool, // TODO: remove updatedFontTheme when theme container is fixed for fontSize 18px
  /**
   * Content to display in the modal.
   */
  children: PropTypes.node,
};

Modal.defaultProps = {
  positiveButtonText: "Confirm",
  negativeButtonText: "Cancel",
};

export default Modal;
