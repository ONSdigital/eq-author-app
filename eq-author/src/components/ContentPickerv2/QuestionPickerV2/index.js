import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { colors } from "constants/theme";

import { getAnswers } from "utils/questionnaireUtils";

import { ReactComponent as WarningIcon } from "assets/icon-warning-round.svg";
import { ReactComponent as FolderIcon } from "assets/icon-folder.svg";

import SelectedAnswersContext, {
  SelectedAnswersProvider,
} from "./SelectedAnswersContext";

import Modal from "components/modals/Modal";
import SearchBar from "components/SearchBar";
import IconText from "components/IconText";
import Button from "components/buttons/Button";
import ButtonGroup from "components/buttons/ButtonGroup";
import ScrollPane from "components/ScrollPane";
import NoSearchResults from "components/NoSearchResults";

import Item from "./Item";
import List from "./List";

const StyledModal = styled(Modal)`
  .Modal {
    padding: 0;
    padding-top: 1em;
    width: 45em;
  }
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
`;

const Footer = styled.footer`
  padding: 1.5em;
`;

const Title = styled.h2`
  font-weight: bold;
  font-size: 1.2em;
  color: ${colors.text};
  margin-bottom: 0.75em;
`;

const WarningPanel = styled(IconText)``;

const isSelected = (selectedItemsArr, item) =>
  selectedItemsArr.findIndex(
    (selectedAnswer) => selectedAnswer.id === item.id
  ) !== -1;

const Answer = ({ answer, pageTitle }) => {
  const { displayName } = answer;
  const { selectedAnswers, updateSelectedAnswers } = useContext(
    SelectedAnswersContext
  );

  const itemSelected = isSelected(selectedAnswers, answer);

  const handleClick = () => {
    if (itemSelected) {
      const selectionWithoutThisAnswer = selectedAnswers.filter(
        (ans) => ans.id !== answer.id
      );
      updateSelectedAnswers(selectionWithoutThisAnswer);
    } else {
      updateSelectedAnswers([...selectedAnswers, answer]);
    }
  };

  return (
    <Item
      title={displayName}
      subtitle={pageTitle}
      onClick={handleClick}
      selected={itemSelected}
    />
  );
};

const Folder = ({ folder }) => {
  const { displayName, pages } = folder;

  const numOfAnswersInFolder = pages.flatMap(({ answers }) => answers).length;

  if (numOfAnswersInFolder > 0) {
    return (
      <Item icon={<FolderIcon />} title={displayName} unselectable>
        <List className="sublist">
          {pages.map(({ displayName: pageTitle, answers }) =>
            answers.map((answer) => (
              <Answer answer={answer} pageTitle={pageTitle} />
            ))
          )}
        </List>
      </Item>
    );
  }

  return null;
};

const Section = ({ section }) => {
  const { displayName, folders } = section;

  const numOfAnswersInSection = folders.flatMap(({ pages }) =>
    pages.flatMap(({ answers }) => answers)
  ).length;

  if (numOfAnswersInSection > 0) {
    return (
      <Item variant="heading" title={displayName}>
        <List>
          {folders.map((folder) => {
            const { enabled, ...rest } = folder;
            if (enabled) {
              return <Folder folder={rest} />;
            } else {
              return rest.pages.map(({ displayName: pageTitle, answers }) =>
                answers.map((answer) => (
                  <Answer answer={answer} pageTitle={pageTitle} />
                ))
              );
            }
          })}
        </List>
      </Item>
    );
  }

  return <React.Fragment />;
};

const QuestionPicker = ({
  title,
  sections,
  warningPanel,
  showSearch,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSections, updateFilteredSections] = useState([]);
  const [selectedAnswers, updateSelectedAnswers] = useState([]);

  useEffect(() => {
    updateFilteredSections(filterList(sections, searchTerm));
  }, [sections, searchTerm]);

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

  const handleCancel = () => {
    onClose();
  };

  const handleSubmit = (selection) => {
    onSubmit(selection);
    onClose();
  };

  return (
    <StyledModal isOpen={isOpen} onClose={handleCancel} hasCloseButton>
      <Header>
        <Title>{title}</Title>
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
        {getAnswers({ sections: filterList(sections, searchTerm) }).length >
        0 ? (
          <ScrollPane>
            <SelectedAnswersProvider
              value={{ selectedAnswers, updateSelectedAnswers }}
            >
              <List>
                {filteredSections.map((section) => (
                  <Section section={section} />
                ))}
              </List>
            </SelectedAnswersProvider>
          </ScrollPane>
        ) : (
          <NoSearchResults
            searchTerm={searchTerm}
            alertText="Please check the answer exists."
          />
        )}
      </Main>
      <Footer>
        <ButtonGroup horizontal align="right">
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            autoFocus
            onClick={() => handleSubmit(selectedAnswers)}
          >
            Select
          </Button>
        </ButtonGroup>
      </Footer>
    </StyledModal>
  );
};

export default QuestionPicker;
