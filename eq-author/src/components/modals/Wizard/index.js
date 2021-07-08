import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Modal from "components/modals/Modal";
import { colors, focusStyle } from "constants/theme";
import DialogButtons from "components/Dialog/DialogButtons";
import Warning from "./Warning";

const BackButton = styled.button`
  position: relative;
  font-size: 0.8em;
  color: ${colors.blue};
  border: 0;
  background: transparent;
  text-decoration: underline;
  cursor: pointer;
  margin: 1em 0 0 0.5em;
  padding: 0.5em;
  &::before {
    content: "<";
    padding-right: 0.5em;
    display: inline-block;
    text-decoration: none;
  }
  &:focus {
    ${focusStyle}
  }
`;

const StyledModal = styled(Modal)`
  .Modal {
    padding: 0;
    min-width: 40%;
  }
`;

export const Wizard = ({
  confirmText = "Next",
  cancelText = "Cancel",
  isOpen = false,
  onConfirm,
  onCancel,
  onBack,
  children,
  confirmEnabled = true,
}) => {
  return (
    <StyledModal isOpen={isOpen} onClose={onCancel} hasCloseButton>
      <BackButton onClick={onBack}>Back</BackButton>
      {children}
      <Footer>
        <DialogButtons
          primaryAction={onConfirm}
          primaryActionText={confirmText}
          secondaryAction={onCancel}
          secondaryActionText={cancelText}
          primaryEnabled={confirmEnabled}
        />
      </Footer>
    </StyledModal>
  );
};

Wizard.propTypes = {
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  isOpen: PropTypes.bool,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  onBack: PropTypes.func,
  children: PropTypes.node,
  confirmEnabled: PropTypes.bool,
};

const Heading = styled.h2`
  margin-top: 0;
  font-size: 1.2em;
  color: ${colors.textLight};
`;

const borderStyle = `border-bottom: 1px solid ${colors.bordersLight};`;

const Subheading = styled.h4`
  margin: 0 0.5em 0 0;
`;

const Header = styled.header`
  padding: 0.5em 1em 1em;
  ${borderStyle}
`;

const Footer = styled.footer`
  padding: 0 1em 1em;
`;

const Content = styled.header`
  padding: 0.5em 1em 1em;
  ${borderStyle}
`;

export { Heading, Subheading, Header, Footer, Content, Warning };
export default Wizard;
