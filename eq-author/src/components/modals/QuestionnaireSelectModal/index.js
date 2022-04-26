import React, { useState } from "react";
import PropTypes from "prop-types";

import * as Headings from "constants/table-headings";

import styled from "styled-components";
import { colors } from "constants/theme";

import Modal from "components/modals/Modal";
import Button from "components/buttons/Button";
import ButtonGroup from "components/buttons/ButtonGroup";
import QuestionnairesView from "components/ImportContentQuestionnairesView";

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

const MenuContainer = styled.div`
  overflow: hidden;
  height: 28em;
`;

const QuestionnaireSelectModal = ({
  isOpen,
  onClose,
  onSelect,
  questionnaires,
}) => {
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);

  const enabledHeadings = [
    Headings.TITLE,
    Headings.OWNER,
    Headings.CREATED,
    Headings.MODIFIED,
  ];

  return (
    <StyledModal isOpen={isOpen} onClose={onClose} hasCloseButton>
      <Container data-test="questionnaire-select-modal">
        <MenuContainer>
          <ModalTitle>Select the source questionnaire</ModalTitle>
          <QuestionnairesView
            questionnaires={questionnaires}
            selectedQuestionnaire={selectedQuestionnaire}
            enabledHeadings={enabledHeadings}
            canCreateQuestionnaire={false}
            padding="small"
            variant="selectModal"
            onQuestionnaireClick={(questionnaireId) =>
              setSelectedQuestionnaire(
                questionnaires.find(({ id }) => id === questionnaireId)
              )
            }
            onCreateQuestionnaire={() => {}}
            onDeleteQuestionnaire={() => {}}
          />
        </MenuContainer>
      </Container>
      <ModalFooter>
        <ButtonGroup horizontal align="right">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => onSelect(selectedQuestionnaire)}
            disabled={!selectedQuestionnaire}
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
  onSelect: PropTypes.func,
  disableSelect: PropTypes.bool,
  questionnaires: PropTypes.arrayOf(PropTypes.object),
};

export default QuestionnaireSelectModal;
