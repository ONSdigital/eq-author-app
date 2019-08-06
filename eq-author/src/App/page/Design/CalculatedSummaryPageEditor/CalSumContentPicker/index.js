import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import CustomPropTypes from "custom-prop-types";
import { CURRENCY, NUMBER, PERCENTAGE } from "constants/answer-types";

import ContentSelector from "./ContentSelector";
import ScrollPane from "components/ScrollPane";
import Modal from "components/modals/Modal";
import Button from "components/buttons/Button";
import ButtonGroup from "components/buttons/ButtonGroup";
import { colors } from "constants/theme";

const ModalFooter = styled.div`
  padding: 1.5em;
  border-top: 1px solid ${colors.bordersLight};
`;

const StyledModal = styled(Modal)`
  .Modal {
    padding: 0;
    width: 45em;
  }
`;

const Container = styled.div`
  background: white;
`;

const ModalTitle = styled.div`
  font-weight: bold;
  font-size: 1.2em;
  color: ${colors.text};
  margin-bottom: 0.2em;
`;

const ModalSubtitle = styled.div`
  font-size: 1em;
  color: ${colors.text};
`;

const ModalHeader = styled.div`
  padding: 2em 1em;
  border-bottom: 1px solid ${colors.bordersLight};
`;

const MenuContainer = styled.div`
  overflow: hidden;
  height: 25em;
`;

const Types = styled.div`
  display: flex;
  align-items: center;
`;

const Type = styled.span`
  font-size: 10px;
  background: #e4e8eb;
  padding: 0.3em 0.7em;
  border-radius: 1em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${colors.text};
  flex: 0 1 auto;
  justify-self: flex-end;
  margin-left: 0.5em;
`;

const validTypes = [CURRENCY, NUMBER, PERCENTAGE];

const CalSumContentPicker = ({
  isOpen,
  onClose,
  onSubmit,
  startingSelectedAnswers,
  ...otherProps
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState(
    startingSelectedAnswers
  );

  useEffect(() => {
    setSelectedAnswers(startingSelectedAnswers);
  }, [startingSelectedAnswers]);

  const closeModal = () => {
    setSelectedAnswers(startingSelectedAnswers);
    onClose();
  };

  const updateSelectedAnswers = answer => {
    if (selectedAnswers.map(ans => ans.id).indexOf(answer.id) === -1) {
      setSelectedAnswers([...selectedAnswers, answer]);
    } else {
      const updatedSelectedAnswers = selectedAnswers.filter(
        ans => ans.id !== answer.id
      );
      setSelectedAnswers(updatedSelectedAnswers);
    }
  };

  return (
    <StyledModal isOpen={isOpen} onClose={closeModal} hasCloseButton>
      <Container>
        <>
          <ModalHeader>
            <ModalTitle>Select one or more answer</ModalTitle>
            <ModalSubtitle>
              <Types>
                <span>Allowed answer types:</span>
                {validTypes.map(type => (
                  <Type key={type}>{type}</Type>
                ))}
              </Types>
            </ModalSubtitle>
          </ModalHeader>
          <MenuContainer>
            <ScrollPane>
              <ContentSelector
                updateSelectedAnswers={updateSelectedAnswers}
                selectedAnswers={selectedAnswers}
                selectedAnswerType={(selectedAnswers[0] || {}).type}
                {...otherProps}
              />
            </ScrollPane>
          </MenuContainer>
        </>
      </Container>
      <ModalFooter>
        <ButtonGroup horizontal align="right">
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            autoFocus
            onClick={() => onSubmit(selectedAnswers)}
          >
            Confirm
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </StyledModal>
  );
};

CalSumContentPicker.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  startingSelectedAnswers: PropTypes.arrayOf(
    PropTypes.shape(CustomPropTypes.answers)
  ),
  startingSelectedType: PropTypes.string,
};

export default CalSumContentPicker;
