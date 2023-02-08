import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import CustomPropTypes from "custom-prop-types";
import { CURRENCY, NUMBER, PERCENTAGE, UNIT } from "constants/answer-types";
import { colors } from "constants/theme";

import { FlatSectionMenu } from "components/ContentPickerv3/Menu";
import ScrollPane from "components/ScrollPane";
import Modal from "components/modals/Modal";
import Button from "components/buttons/Button";
import ButtonGroup from "components/buttons/ButtonGroup";
import SearchBar from "components/SearchBar";
import searchByAnswerTitleQuestionTitleShortCode from "utils/searchFunctions/searchByAnswerTitleQuestionTitleShortCode";

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
  margin-bottom: 0.75em;
`;

const ModalSubtitle = styled.div`
  font-size: 1em;
  color: ${colors.text};
  margin-bottom: 1em;
`;

const ModalHeader = styled.div`
  padding: 2em 1em 1.5em;
  border-bottom: 1px solid ${colors.bordersLight};
`;

const ModalToolbar = styled.div`
  display: flex;
  justify-content: space-between;
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

const validTypes = [CURRENCY, NUMBER, PERCENTAGE, UNIT];

const QuestionPicker = ({
  data,
  isOpen,
  onClose,
  onSubmit,
  startingSelectedAnswers,
  title,
  showTypes,
  ...otherProps
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState(
    startingSelectedAnswers
  );
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (data) {
      setSearchResults(data);
    }
  }, [data]);

  useEffect(() => {
    if (searchTerm && searchTerm !== "" && searchTerm !== " ") {
      const results = searchByAnswerTitleQuestionTitleShortCode(
        data,
        searchTerm
      );

      setSearchResults(results);
    } else {
      setSearchResults(data);
    }
  }, [searchTerm, data]);

  useEffect(() => {
    setSelectedAnswers(startingSelectedAnswers);
  }, [startingSelectedAnswers]);

  const closeModal = () => {
    setSelectedAnswers(startingSelectedAnswers);
    onClose();
  };

  const updateSelectedAnswers = (answer) => {
    if (selectedAnswers.map((ans) => ans.id).indexOf(answer.id) === -1) {
      setSelectedAnswers([...selectedAnswers, answer]);
    } else {
      const updatedSelectedAnswers = selectedAnswers.filter(
        (ans) => ans.id !== answer.id
      );
      setSelectedAnswers(updatedSelectedAnswers);
    }
  };

  const isSelected = (answer) =>
    selectedAnswers.findIndex(
      (selectedAnswer) => selectedAnswer.id === answer.id
    ) !== -1;

  const isDisabled = (answer) => {
    if (selectedAnswers.map(({ id }) => id).includes(answer.id)) {
      return;
    }
    if (selectedAnswers.length > 0) {
      const selectedType = selectedAnswers[0].type;
      if (selectedType === UNIT) {
        return answer.properties.unit !== selectedAnswers[0].properties.unit;
      }
      return answer.type !== selectedAnswers[0].type;
    }
    return false;
  };

  return (
    <StyledModal isOpen={isOpen} onClose={closeModal} hasCloseButton>
      <Container>
        <>
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            {/* <ModalSubtitle>
              {showTypes ? (
                <Types>
                  <span>Allowed answer types:</span>
                  {validTypes.map((type) => (
                    <Type key={type}>{type}</Type>
                  ))}
                </Types>
              ) : (
                ""
              )}
            </ModalSubtitle> */}
            <ModalSubtitle>
              Answers can only be selected from the current section. Calculated
              summary totals can be selected from both current and previous
              sections.
            </ModalSubtitle>
            <ModalToolbar>
              <SearchBar
                onChange={({ value }) => setSearchTerm(value)}
                placeholder="Search for an answer or total"
              />
            </ModalToolbar>
          </ModalHeader>
          <MenuContainer>
            <ScrollPane>
              <FlatSectionMenu
                onSelected={updateSelectedAnswers}
                selectedAnswers={selectedAnswers}
                isDisabled={isDisabled}
                isSelected={isSelected}
                data={searchResults}
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
            Select
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </StyledModal>
  );
};

QuestionPicker.propTypes = {
  data: PropTypes.arrayOf(CustomPropTypes.section),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  startingSelectedAnswers: PropTypes.arrayOf(
    PropTypes.shape(CustomPropTypes.answers)
  ),
  startingSelectedType: PropTypes.string,
  title: PropTypes.string.isRequired,
  showTypes: PropTypes.bool,
};

export default QuestionPicker;
