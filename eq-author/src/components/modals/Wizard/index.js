import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Modal from "components/modals/Modal";
import { colors, focusStyle, getTextHoverStyle } from "constants/theme";
import DialogButtons from "components/Dialog/DialogButtons";
import Warning from "./Warning";
import { ReactComponent as Chevron } from "assets/icon-chevron-left.svg";

const BackButton = styled.button`
  position: relative;
  top: -0.5em;
  left: -0.25em;
  font-weight: bold;
  font-size: 0.8em;
  color: ${colors.darkGrey};
  border: 0;
  background: transparent;
  text-decoration: underline;
  cursor: pointer;
  margin: 1em 0 0 0.5em;
  padding: 0.5em;
  &:focus {
    ${focusStyle}
  }
  svg {
    width: 1.5em;

    path:last-of-type {
      fill: currentColor;
    }
  }
  ${getTextHoverStyle(colors.darkGrey)}
`;

const StyledModal = styled(Modal)`
  .Modal {
    padding: 0;
    min-width: 40%;
  }
`;

export const SpacedRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
      <BackButton onClick={onBack}>
        <SpacedRow>
          <Chevron /> Back
        </SpacedRow>
      </BackButton>
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
  padding: 0 1em 1em;
  ${borderStyle}
`;

const Footer = styled.footer`
  background-color: white;
  z-index: 99;
  padding: 0 1em 1em;
`;

const Content = styled.main`
  padding: 0 1em 1em;
  ${borderStyle}
`;

export { Heading, Subheading, Header, Footer, Content, Warning };
export default Wizard;
