import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { getPages } from "utils/questionnaireUtils";
import { stripHtmlToText } from "utils/stripHTML";
import searchByQuestionTitleOrShortCode from "utils/searchFunctions/searchByQuestionTitleShortCode";
import isListCollectorPageType from "utils/isListCollectorPageType";

import { colors } from "constants/theme";

import { ReactComponent as WarningIcon } from "assets/icon-warning-round.svg";
import { ReactComponent as FolderIcon } from "assets/icon-folder.svg";

import SelectedPageContext, {
  SelectedPagesProvider,
} from "./SelectedPagesContext";

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
  color: ${colors.darkGrey};
  margin-bottom: 0.75em;
`;

const WarningPanel = styled(IconText)`
  font-weight: bold;
`;

const isSelected = (items, target) => items.find(({ id }) => id === target.id);

const Page = ({ page }) => {
  const { title, displayName, pageType, alias } = page;
  const { selectedPages, updateSelectedPages } =
    useContext(SelectedPageContext);

  const itemSelected = isSelected(selectedPages, page);

  const handleClick = () => {
    if (itemSelected) {
      const selectionWithoutThisPage = selectedPages.filter(
        (selectedPage) => selectedPage.id !== page.id
      );
      updateSelectedPages(selectionWithoutThisPage);
    } else {
      updateSelectedPages([...selectedPages, page]);
    }
  };
  return (
    !isListCollectorPageType(pageType) && (
      <Item
        title={stripHtmlToText(title) || displayName}
        subtitle={alias}
        onClick={handleClick}
        selected={Boolean(itemSelected)}
        dataTest="Page"
      />
    )
  );
};
Page.propTypes = {
  page: PropTypes.object, // eslint-disable-line
};

const Folder = ({ folder }) => {
  const { displayName, pages } = folder;

  const numOfPagesInFolder = pages.length;

  if (numOfPagesInFolder > 0) {
    return (
      <Item
        icon={<FolderIcon />}
        title={displayName}
        unselectable
        dataTest="folder"
      >
        <List className="sublist">
          {pages.map((page) => (
            <Page key={`page-${page.id}`} page={page} />
          ))}
        </List>
      </Item>
    );
  }

  return <React.Fragment />;
};
Folder.propTypes = {
  folder: PropTypes.object, // eslint-disable-line
};

const Section = ({ section }) => {
  const { displayName, folders } = section;

  const numOfPagesInSection = getPages({ sections: [section] }).length;

  if (numOfPagesInSection > 0) {
    return (
      <Item variant="heading" title={displayName} unselectable>
        <List>
          {folders.map((folder) => {
            const { enabled } = folder;
            if (enabled) {
              return <Folder key={`folder-${folder.id}`} folder={folder} />;
            } else {
              return folder.pages.map((page) => (
                <Page key={`page-${page.id}`} page={page} />
              ));
            }
          })}
        </List>
      </Item>
    );
  }

  return <React.Fragment />;
};
Section.propTypes = {
  section: PropTypes.object, // eslint-disable-line
};

const QuestionPicker = ({
  title,
  sections,
  warningPanel,
  showSearch,
  isOpen,
  onClose,
  onCancel,
  onSubmit,
  startingSelectedQuestions = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSections, updateFilteredSections] = useState([]);
  const [selectedPages, updateSelectedPages] = useState([]);

  useEffect(() => {
    updateFilteredSections(
      searchByQuestionTitleOrShortCode(sections, searchTerm)
    );
  }, [sections, searchTerm]);

  useEffect(() => {
    updateSelectedPages(startingSelectedQuestions);
  }, [startingSelectedQuestions]);

  const handleSubmit = (selection) => {
    onSubmit(selection);
  };

  return (
    <StyledModal isOpen={isOpen} onClose={onClose} hasCloseButton>
      <Header>
        <Title>{title}</Title>
        {showSearch && (
          <SearchBar
            size="large"
            onChange={({ value }) => setSearchTerm(value)}
            placeholder="Search questions"
          />
        )}
        {warningPanel && (
          <WarningPanel icon={WarningIcon} left>
            {warningPanel}
          </WarningPanel>
        )}
      </Header>
      <Main>
        {getPages({
          sections: searchByQuestionTitleOrShortCode(sections, searchTerm),
        }).length > 0 ? (
          <ScrollPane>
            <SelectedPagesProvider
              value={{ selectedPages, updateSelectedPages }}
            >
              <List>
                {filteredSections.map((section) => (
                  <Section key={`section-${section.id}`} section={section} />
                ))}
              </List>
            </SelectedPagesProvider>
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
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            autoFocus
            disabled={selectedPages.length === 0}
            onClick={() => handleSubmit(selectedPages)}
          >
            Select
          </Button>
        </ButtonGroup>
      </Footer>
    </StyledModal>
  );
};
QuestionPicker.propTypes = {
  title: PropTypes.string.isRequired,
  sections: PropTypes.array.isRequired, // eslint-disable-line
  startingSelectedQuestions: PropTypes.array, // eslint-disable-line
  warningPanel: PropTypes.string,
  showSearch: PropTypes.bool,
  isOpen: PropTypes.bool,
  /**
   * Called when the 'x' button is pressed;
   */
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  /**
   * Called when the 'Select' button is pressed (before the 'onClose' function is called).
   *
   * This function is passed an array of pages that are the pages the user selected.
   *
   * You don't need to have this handler close the modal, as the 'Select' button calls the
   * 'onClose' function after running 'onSubmit'.
   */
  onSubmit: PropTypes.func.isRequired,
};

export default QuestionPicker;
