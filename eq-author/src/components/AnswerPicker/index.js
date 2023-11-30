import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import CustomPropTypes from "custom-prop-types";
import { UNIT } from "constants/answer-types";
import { colors } from "constants/theme";

import { FlatSectionMenu } from "components/ContentPickerv3/Menu";
import ScrollPane from "components/ScrollPane";
import Modal from "components/modals/Modal";
import Button from "components/buttons/Button";
import ButtonGroup from "components/buttons/ButtonGroup";
import SearchBar from "components/SearchBar";
import searchByAnswerTitleQuestionTitleShortCode from "utils/searchFunctions/searchByAnswerTitleQuestionTitleShortCode";
import { getPageByAnswerId } from "utils/questionnaireUtils";

const ModalFooter = styled.div`
  padding: 1.5em;
  border-top: 1px solid ${colors.bordersLight};
`;

const StyledModal = styled(Modal)`
  .Modal {
    padding: 0;
    width: 50em;
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
  height: 20em;
  display: flex;
`;

const ContentCustomMargin = styled.p`
  margin-bottom: 0.2em;
`;

const UnorderedList = styled.ul`
  padding-left: 0;
  margin-top: 0;
  margin-left: 2em;
`;

const ListItem = styled.li``;

const QuestionPicker = ({
  data,
  questionnaire,
  isOpen,
  onClose,
  onSubmit,
  startingSelectedAnswers,
  title,
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
    const selectedPage = getPageByAnswerId(
      questionnaire,
      selectedAnswers[0]?.id
    );
    const page = getPageByAnswerId(questionnaire, answer.id);

    if (selectedAnswers.length > 0) {
      const selectedType = selectedAnswers[0].type;

      if (selectedPage && page && page?.pageType === "CalculatedSummaryPage") {
        return (
          selectedPage?.pageType !== "CalculatedSummaryPage" ||
          selectedType !== answer.type
        );
      }

      if (selectedType === UNIT) {
        return answer.properties.unit !== selectedAnswers[0].properties.unit;
      }

      return selectedPage?.pageType !== "CalculatedSummaryPage"
        ? answer.type !== selectedAnswers[0].type
        : page?.pageType === "QuestionPage";
    }
    return false;
  };

  return (
    <StyledModal isOpen={isOpen} onClose={closeModal} hasCloseButton>
      <Container>
        <>
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            <ModalSubtitle>
              The answers being totalled must belong to the same section, except
              for the totals of other calculated summaries, which can come from
              different sections.
            </ModalSubtitle>
            <ContentCustomMargin>
              A calculated summary must include at least:
            </ContentCustomMargin>
            <UnorderedList>
              <ListItem>2 answers of the same type</ListItem>
              <ListItem>
                or 1 answer from a list collector follow-up question
              </ListItem>
              <ListItem>or 2 calculated summary totals</ListItem>
            </UnorderedList>
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
                isCalculatedSummary
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
            data-test="select-summary-answers"
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
  questionnaire: CustomPropTypes.questionnaire,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  startingSelectedAnswers: PropTypes.arrayOf(
    PropTypes.shape(CustomPropTypes.answers)
  ),
  startingSelectedType: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default QuestionPicker;
