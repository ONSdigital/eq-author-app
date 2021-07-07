import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { colors } from "constants/theme";

import { getPages } from "utils/questionnaireUtils";

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
  color: ${colors.text};
  margin-bottom: 0.75em;
`;

const WarningPanel = styled(IconText)``;

const isSelected = (selectedItemsArr, item) =>
  selectedItemsArr.findIndex(
    (selectedAnswer) => selectedAnswer.id === item.id
  ) !== -1;

const Page = ({ page }) => {
  const { title, displayName, alias } = page;
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
    <Item
      title={title.replace(/(<([^>]+)>)/gi, "") || displayName}
      subtitle={alias}
      onClick={handleClick}
      selected={itemSelected}
      dataTest="Page"
    />
  );
};

const Folder = ({ folder }) => {
  const { displayName, pages } = folder;

  const numOfPagesInFolder = pages.flatMap(({ pages }) => pages).length;

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

const Section = ({ section }) => {
  const { displayName, folders } = section;

  const numOfPagesInSection = folders.flatMap(({ pages }) =>
    pages.flatMap(({ pages }) => pages)
  ).length;

  if (numOfPagesInSection > 0) {
    return (
      <Item variant="heading" title={displayName}>
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
  const [selectedPages, updateSelectedPages] = useState([]);

  useEffect(() => {
    updateFilteredSections(filterList(sections, searchTerm));
  }, [sections, searchTerm]);

  const filterList = (data, searchTerm) =>
    data.map(({ folders, ...rest }) => ({
      folders: folders.map(({ pages, ...rest }) => ({
        pages: pages.filter(({ displayName }) =>
          displayName.includes(searchTerm)
        ),
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
        {getPages({ sections: filterList(sections, searchTerm) }).length > 0 ? (
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
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            autoFocus
            onClick={() => handleSubmit(selectedPages)}
          >
            Select
          </Button>
        </ButtonGroup>
      </Footer>
    </StyledModal>
  );
};

export default QuestionPicker;
