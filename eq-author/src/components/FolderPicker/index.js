import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import searchByFolderTitleOrShortCode from "../../utils/searchFunctions/searchByFolderTitleOrShortCode";
import { getFolders } from "utils/questionnaireUtils";

import { colors } from "constants/theme";

import SelectedFolderContext, {
  SelectedFoldersProvider,
} from "./SelectedFoldersContext";

import { ReactComponent as WarningIcon } from "assets/icon-warning-round.svg";

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

const Header = styled.div`
  margin: 0 1.5em;
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
  font-size: 1.1em;
  margin-bottom: 0.8em;

  svg {
    width: 3em;
    height: 3em;
    margin-right: 0.5em;
  }
`;

const SearchBarWrapper = styled.div`
  margin-bottom: 1.5em;
`;

const isSelected = (items, target) => items.find(({ id }) => id === target.id);

const Folder = ({ folder }) => {
  const { title, alias, displayName, listId } = folder;
  const { selectedFolders, updateSelectedFolders } = useContext(
    SelectedFolderContext
  );

  const itemSelected = isSelected(selectedFolders, folder);

  const handleClick = () => {
    if (itemSelected) {
      const selectionWithoutThisFolder = selectedFolders.filter(
        (selectedFolder) => selectedFolder.id !== folder.id
      );
      updateSelectedFolders(selectionWithoutThisFolder);
    } else {
      updateSelectedFolders([...selectedFolders, folder]);
    }
  };

  return (
    <Item
      title={title || alias || displayName}
      subtitle={title && alias}
      isListCollector={Boolean(listId)}
      onClick={handleClick}
      selected={Boolean(itemSelected)}
      dataTest="folder-picker-item"
    />
  );
};

Folder.propTypes = {
  folder: PropTypes.object, // eslint-disable-line
};

const Section = ({ section }) => {
  const { displayName, folders } = section;

  const numOfFoldersInSection = getFolders({ sections: [section] }).length;

  if (numOfFoldersInSection > 0) {
    return (
      <Item variant="heading" title={displayName} unselectable>
        <List>
          {folders.map((folder) => {
            return <Folder key={`folder-${folder.id}`} folder={folder} />;
          })}
        </List>
      </Item>
    );
  }

  // Handles sections with no folders matching the search term
  return <React.Fragment />;
};

Section.propTypes = {
  section: PropTypes.object, // eslint-disable-line
};

const FolderPicker = ({
  title,
  sections,
  showSearch,
  isOpen,
  warningMessage,
  onClose,
  onCancel,
  onSubmit,
  startingSelectedFolders = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSections, updateFilteredSections] = useState([]);
  const [selectedFolders, updateSelectedFolders] = useState([]);

  useEffect(() => {
    updateFilteredSections(
      searchByFolderTitleOrShortCode(sections, searchTerm)
    );
  }, [sections, searchTerm]);

  useEffect(() => {
    updateSelectedFolders(startingSelectedFolders);
  }, [startingSelectedFolders]);

  const handleSubmit = (selection) => {
    onSubmit(selection);
  };

  return (
    <StyledModal isOpen={isOpen} onClose={onClose} hasCloseButton>
      <Header>
        <Title>{title}</Title>
        {warningMessage && (
          <WarningPanel icon={WarningIcon} left>
            {warningMessage}
          </WarningPanel>
        )}
        {showSearch && (
          <SearchBarWrapper>
            <SearchBar
              size="large"
              onChange={({ value }) => setSearchTerm(value)}
              placeholder="Search folders"
            />
          </SearchBarWrapper>
        )}
      </Header>
      <Main>
        {searchTerm === "" ||
        (searchTerm !== "" &&
          // Checks if there are any sections with folders matching the search term
          searchByFolderTitleOrShortCode(sections, searchTerm).some(
            (section) => section.folders.length > 0
          )) ? (
          <ScrollPane>
            <SelectedFoldersProvider
              value={{ selectedFolders, updateSelectedFolders }}
            >
              <List>
                {filteredSections.map((section) => (
                  <Section key={`section-${section.id}`} section={section} />
                ))}
              </List>
            </SelectedFoldersProvider>
          </ScrollPane>
        ) : (
          <NoSearchResults
            searchTerm={searchTerm}
            alertText="Please check the folder exists."
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
            disabled={selectedFolders.length === 0}
            onClick={() => handleSubmit(selectedFolders)}
          >
            Select
          </Button>
        </ButtonGroup>
      </Footer>
    </StyledModal>
  );
};

FolderPicker.propTypes = {
  title: PropTypes.string.isRequired,
  sections: PropTypes.array.isRequired, // eslint-disable-line
  startingSelectedFolders: PropTypes.array, // eslint-disable-line
  showSearch: PropTypes.bool,
  warningMessage: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default FolderPicker;
