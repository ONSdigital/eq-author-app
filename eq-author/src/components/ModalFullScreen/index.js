import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { colors } from "constants/theme";
import Modal, { CloseButton } from "components/Modal";
import ScrollPane from "components/ScrollPane";

const topOffset = "4em"; //Header height

const StyledModal = styled(Modal)`
  .Overlay {
    background-color: transparent;
  }
  .Modal {
    width: 100%;
    top: ${topOffset};
    height: calc(100% - ${topOffset});
    background: ${colors.lighterGrey};
    padding: 0;
  }
`;

const ModalFullScreen = props => {
  const { children, onClose, isOpen, ...otherProps } = props;
  return (
    <StyledModal
      isOpen={isOpen}
      onClose={onClose}
      hasCloseButton={false}
      {...otherProps}
    >
      <ScrollPane>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        {children}
      </ScrollPane>
    </StyledModal>
  );
};

ModalFullScreen.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired
};

export default ModalFullScreen;
