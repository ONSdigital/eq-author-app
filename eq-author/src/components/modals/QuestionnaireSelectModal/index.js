import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";
import { colors } from "constants/theme";
import Modal from "components/modals/Modal";
import Button from "components/buttons/Button";
import ButtonGroup from "components/buttons/ButtonGroup";
import ScrollPane from "components/ScrollPane";
import Panel from "components/Panel";

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
  color: ${colors.text};
  margin-bottom: 0.75em;
  color: ${colors.textLight};
`;

const ModalSubtitle = styled.div`
  font-size: 1em;
  color: ${colors.text};
`;

const ModalHeader = styled.header`
  padding: 2em 1em 1.5em;
  border-bottom: 1px solid ${colors.bordersLight};
`;

const MenuContainer = styled.div`
  overflow: hidden;
  height: 25em;
`;

const Wrapper = styled.div`
  margin: 1em 0;
  display: flex;
  z-index: 1;
  align-items: center;
  justify-content: space-between;
`;

const QuestionnaireSelectModal = ({
    searchBar,
    accessFilter,
    children
}) => {
    return (
      <StyledModal isOpen hasCloseButton >
      <Container data-test="questionnaire-select-modal">
        <>
          <ModalHeader>
            <ModalTitle>Select the source questionnaire</ModalTitle>
            <ModalSubtitle>
                <Wrapper>
                  {/* //TODO needs onChange prop setup and passed here
                  // see example in App/QuestionnairesPage/QuestionnairesView/Header */}
                  {searchBar}
                  {accessFilter}
                </Wrapper>
            </ModalSubtitle>
          </ModalHeader>
          <MenuContainer>
            <ScrollPane>
            <Panel>
            {children}
            </Panel>
            </ScrollPane>
          </MenuContainer>
        </>
      </Container>
      <ModalFooter>
        <ButtonGroup horizontal align="right">
          <Button variant="secondary" >
            Cancel
          </Button>
          <Button
            variant="primary"
            autoFocus
            onClick={() => alert("clicked!")}
          >
            Select
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </StyledModal>
    );
};

QuestionnaireSelectModal.propTypes = {
    searchBar: PropTypes.node,
    accessFilter: PropTypes.node,
    children: PropTypes.node,
};

export default QuestionnaireSelectModal;