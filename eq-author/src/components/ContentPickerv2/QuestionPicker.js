import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import CustomPropTypes from "custom-prop-types";
import { CURRENCY, NUMBER, PERCENTAGE, UNIT } from "constants/answer-types";

import { FlatSectionMenu } from "components/ContentPickerv2/Menu";
import ScrollPane from "components/ScrollPane";
import Modal from "components/modals/Modal";
import Button from "components/buttons/Button";
import ButtonGroup from "components/buttons/ButtonGroup";
import { colors } from "constants/theme";

import { Input } from "components/Forms";
import VisuallyHidden from "components/VisuallyHidden";

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

const Search = styled.div`
  position: relative;
  &::before {
    /* content: url(${iconSearch}); */
    display: inline-block;
    position: absolute;
    left: 0.5em;
    top: 0;
    bottom: 0;
    height: 2em;
    margin: auto;
  }
`;

const SearchInput = styled(Input).attrs({
  type: "search",
  placeholder: "Search",
})`
  width: 20em;
  padding: 0.6em;
  line-height: 1;
  padding-left: 2.5em;
  border-radius: 4px;
  border-color: ${colors.bordersLight};

  &:hover {
    outline: none;
  }
`;

const validTypes = [CURRENCY, NUMBER, PERCENTAGE, UNIT];

const QuestionPicker = ({
  isOpen,
  onClose,
  onSubmit,
  startingSelectedAnswers,
  title,
  showTypes,
  showSearch,
  ...otherProps
}) => {

  console.log('otherProps :>> ', otherProps);
  console.log('startingSelectedAnswers :>> ', startingSelectedAnswers);
  
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
            <ModalSubtitle>
              {showTypes ? (
                <Types>
                  <span>Allowed answer types:</span>
                  {validTypes.map((type) => (
                    <Type key={type}>{type}</Type>
                  ))}
                </Types>) : ('')
              }
              {
                showSearch ? (
                  <Search>
                    <VisuallyHidden>
                      <label htmlFor="search">Search</label>
                    </VisuallyHidden>
                    <SearchInput
                      id="search"
                      defaultValue={""}
                      // onChange={}
                    />
                  </Search>
                ) : ('')
              }
            </ModalSubtitle>
          </ModalHeader>
          <MenuContainer>
            <ScrollPane>
              <FlatSectionMenu
                onSelected={updateSelectedAnswers}
                selectedAnswers={selectedAnswers}
                isDisabled={isDisabled}
                isSelected={isSelected}
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
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  startingSelectedAnswers: PropTypes.arrayOf(
    PropTypes.shape(CustomPropTypes.answers)
  ),
  startingSelectedType: PropTypes.string,
  title: PropTypes.string.isRequired,
  showTypes: PropTypes.bool,
  showSearch: PropTypes.bool
};

export default QuestionPicker;
