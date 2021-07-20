import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";
import { colors } from "constants/theme";
import Modal from "components/modals/Modal";
import Button from "components/buttons/Button";
import ButtonGroup from "components/buttons/ButtonGroup";

const ModalFooter = styled.footer`
  padding: 1.5em;
  border-top: 1px solid ${colors.bordersLight};
`;

const StyledModal = styled(Modal)`
  .Modal {
    padding: 0;
    width: 55em;
  }
`;

const Container = styled.div`
  background: white;
`;

const ModalTitle = styled.h2`
  font-weight: bold;
  font-size: 1.2em;
  margin-bottom: 0.25em;
  color: ${colors.textLight};
  padding-left: 1em;
`;

const Panel = styled.div`
  background-color: ${colors.white};
`;

const MenuContainer = styled.div`
  overflow: hidden;
  height: 28em;
`;

const QuestionnaireSelectModal = ({
  isOpen,
  onClose,
  onSelect,
  children,
  disableSelect,
}) => {
  return (
    <StyledModal isOpen={isOpen} onClose={onClose} hasCloseButton>
      <Container data-test="questionnaire-select-modal">
        <>
          <MenuContainer>
            <ModalTitle>Select the source questionnaire</ModalTitle>
            <Panel>{children}</Panel>
          </MenuContainer>
        </>
      </Container>
      <ModalFooter>
        <ButtonGroup horizontal align="right">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            autoFocus
            onClick={onSelect}
            disabled={disableSelect}
          >
            Select
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </StyledModal>
  );
};

QuestionnaireSelectModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default QuestionnaireSelectModal;
