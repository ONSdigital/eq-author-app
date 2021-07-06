import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import CustomPropTypes from "custom-prop-types";
import { CURRENCY, NUMBER, PERCENTAGE, UNIT } from "constants/answer-types";
import { colors } from "constants/theme";

import { FlatSectionMenu } from "components/ContentPickerv2/Menu";
import ScrollPane from "components/ScrollPane";
import Modal from "components/modals/Modal";
import Button from "components/buttons/Button";
import ButtonGroup from "components/buttons/ButtonGroup";
import SearchBar from "components/SearchBar";
import IconText from "components/IconText";
import NoSearchResults from "components/NoSearchResults";

import { ReactComponent as WarningIcon } from "assets/icon-warning-round.svg";

import { getAnswers } from "utils/questionnaireUtils";

const Footer = styled.footer`
  padding: 1.5em;
  border-top: 1px solid ${colors.bordersLight};
`;

const StyledModal = styled(Modal)`
  .Modal {
    padding: 0;
    padding-top: 1em;
    width: 45em;
  }
`;

const Title = styled.h2`
  font-weight: bold;
  font-size: 1.2em;
  color: ${colors.text};
  margin-bottom: 0.75em;
`;

const Header = styled.header`
  margin: 0 1.5em;

  > * {
    margin-bottom: 0.5em;
  }
`;

const Main = styled.main`
  overflow: hidden;
  height: 25em;
  border-top: 1px solid ${colors.bordersLight};
`;

const Types = styled.div`
  display: flex;
  align-items: center;
`;

const TypeCaption = styled.p`
  margin: 0;
  padding: 0;
`;

const Type = styled.p`
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

const WarningPanel = styled(IconText)``;

const validTypes = [CURRENCY, NUMBER, PERCENTAGE, UNIT];

const QuestionPicker = ({
  isOpen,
  onClose,
  onSubmit,
  startingSelectedAnswers,
  title,
  showTypes,
  showSearch,
  warningPanel,
  data,
  ...otherProps
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, updateFilteredData] = useState([]);

  useEffect(() => {
    setSelectedAnswers(startingSelectedAnswers);
  }, [startingSelectedAnswers]);

  useEffect(() => {
    updateFilteredData(filterList(data, searchTerm));
  }, [data, searchTerm]);

  const closeModal = () => {
    setSelectedAnswers(startingSelectedAnswers);
    setSearchTerm("");
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

  const filterList = (data, searchTerm) =>
    data.map(({ folders, ...rest }) => ({
      folders: folders.map(({ pages, ...rest }) => ({
        pages: pages.map(({ answers, ...rest }) => ({
          answers: answers.filter(({ displayName }) =>
            displayName.includes(searchTerm)
          ),
          ...rest,
        })),
        ...rest,
      })),
      ...rest,
    }));

  return (
    <StyledModal isOpen={isOpen} onClose={closeModal} hasCloseButton>
      <Header>
        <Title>{title}</Title>
        {showTypes && (
          <Types>
            <TypeCaption>Allowed answer types:</TypeCaption>
            {validTypes.map((type) => (
              <Type key={type}>{type}</Type>
            ))}
          </Types>
        )}
        {showSearch && (
          <SearchBar
            size="large"
            onChange={({ value }) => setSearchTerm(value)}
          />
        )}
        {warningPanel && (
          <WarningPanel icon={WarningIcon} left>
            {warningPanel}
          </WarningPanel>
        )}
      </Header>
      <Main>
        <ScrollPane>
          {getAnswers({ sections: filteredData }).length > 0 ? (
            <FlatSectionMenu
              onSelected={updateSelectedAnswers}
              selectedAnswers={selectedAnswers}
              isDisabled={isDisabled}
              isSelected={isSelected}
              data={filteredData}
              {...otherProps}
            />
          ) : (
            <NoSearchResults
              searchTerm={searchTerm}
              alertText="Please check the answer exists."
            />
          )}
        </ScrollPane>
      </Main>
      <Footer>
        <ButtonGroup horizontal align="right">
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            autoFocus
            onClick={() => {
              setSearchTerm("");
              onSubmit(selectedAnswers);
              onClose();
            }}
          >
            Select
          </Button>
        </ButtonGroup>
      </Footer>
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
  showSearch: PropTypes.bool,
};

export default QuestionPicker;
