import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme.js";
import Theme from "contexts/themeContext";

import Button from "components-themed/buttons";
import Warning from "components-themed/Warning";

const ModalBackground = styled.div`
  position: fixed;
  z-index: 20; /* z-index of 20 as Add / import content button has z-index of 15 */
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #000000;
  opacity: 0.5;
`;

const ModalContainer = styled.div`
  background-color: #fefefe;
  top: 10.3em;
  left: 33.6em;
  padding: 20px;
  border: 1px solid #888;
  /* height: 20%; */
  width: 25em;
  z-index: 20; /* z-index of 20 as Add / import content button has z-index of 15 */
  position: fixed;
`;

const CloseButton = styled.span`
  color: ${({ theme }) => theme.colors.text};
  float: right;
  font-size: 32px;
  cursor: pointer;
`;

const Title = styled.h2``;

const Modal = ({
  title,
  warningMessage,
  positiveButtonText,
  negativeButtonText,
  isOpen,
  onClose,
}) => {
  return (
    isOpen && (
      <Theme themeName={"ons"}>
        <ModalBackground onClick={onClose} />
        <ModalContainer>
          <CloseButton onClick={onClose}>&times;</CloseButton>
          <Title>{title}</Title>
          <Warning bold>{warningMessage}</Warning>
          <Button variant="primary">{positiveButtonText}</Button>
          <Button variant="secondary">{negativeButtonText}</Button>
        </ModalContainer>
      </Theme>
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
   * Function to close the modal.
   */
  onClose: PropTypes.func,
};

Modal.defaultProps = {
  positiveButtonText: "Confirm",
  negativeButtonText: "Cancel",
};

export default Modal;
