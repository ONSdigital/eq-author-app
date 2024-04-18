import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import searchByFolderTitleOrShortCode from "../../utils/searchFunctions/searchByFolderTitleOrShortCode";
import { getFolders } from "utils/questionnaireUtils";

import { colors } from "constants/theme";

import SelectedFolderContext, {
  SelectedFoldersProvider,
} from "./SelectedFoldersContext";

import Modal from "components/modals/Modal";
import SearchBar from "components/SearchBar";
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
    margin-bottom: 2em;
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

const isSelected = (items, target) => items.find(({ id }) => id === target.id);

const Folder = ({ folder }) => {
  const { title, alias, displayName } = folder;
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
      onClick={handleClick}
      selected={Boolean(itemSelected)}
      dataTest="folder-picker-item"
    />
  );
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

const FolderPicker = ({
  title,
  sections,
  showSearch,
  isOpen,
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
        {showSearch && (
          <SearchBar
            size="large"
            onChange={({ value }) => setSearchTerm(value)}
            placeholder="Search folders"
          />
        )}
      </Header>
      <Main>
        {searchTerm === "" ||
        (searchTerm !== "" &&
          searchByFolderTitleOrShortCode(sections, searchTerm).length > 0) ? (
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

Folder.propTypes = {
  folder: PropTypes.object, // eslint-disable-line
};

Section.propTypes = {
  section: PropTypes.object, // eslint-disable-line
};

FolderPicker.propTypes = {
  title: PropTypes.string.isRequired,
  sections: PropTypes.array.isRequired, // eslint-disable-line
  startingSelectedFolders: PropTypes.array, // eslint-disable-line
  showSearch: PropTypes.bool,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default FolderPicker;
