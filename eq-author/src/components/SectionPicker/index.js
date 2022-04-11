import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { stripHtmlToText } from "utils/stripHTML";
import searchBySectionTitleOrShortCode from "utils/searchFunctions/searchBySectionTitleShortCode";

import { colors } from "constants/theme";

import SelectedSectionContext, {
  SelectedSectionsProvider,
} from "./SelectedSectionsContext";

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

const Section = ({ section }) => {
  const { title, displayName, alias, position } = section;
  const { selectedSections, updateSelectedSections } = useContext(
    SelectedSectionContext
  );

  const itemSelected = isSelected(selectedSections, section);

  const handleClick = () => {
    if (itemSelected) {
      const selectionWithoutThisSection = selectedSections.filter(
        (selectedSection) => selectedSection.id !== section.id
      );
      updateSelectedSections(selectionWithoutThisSection);
    } else {
      updateSelectedSections([...selectedSections, section]);
    }
  };
  return (
    <Item
      title={stripHtmlToText(title) || displayName}
      subtitle={alias}
      onClick={handleClick}
      selected={Boolean(itemSelected)}
      position={position}
      dataTest="SectionPickerItem"
    />
  );
};
Section.propTypes = {
  section: PropTypes.object, // eslint-disable-line
};

const SectionPicker = ({
  title,
  sections,
  showSearch,
  isOpen,
  onClose,
  onCancel,
  onSubmit,
  startingSelectedSections = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSections, updateFilteredSections] = useState([]);
  const [selectedSections, updateSelectedSections] = useState([]);

  useEffect(() => {
    updateFilteredSections(
      searchBySectionTitleOrShortCode(sections, searchTerm)
    );
  }, [sections, searchTerm]);

  useEffect(() => {
    updateSelectedSections(startingSelectedSections);
  }, [startingSelectedSections]);

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
          />
        )}
      </Header>
      <Main>
        {searchTerm === "" ||
        (searchTerm !== "" &&
          searchBySectionTitleOrShortCode(sections, searchTerm).length > 0) ? (
          <ScrollPane>
            <SelectedSectionsProvider
              value={{ selectedSections, updateSelectedSections }}
            >
              <List>
                {filteredSections.map((section) => (
                  <Section key={`section-${section.id}`} section={section} />
                ))}
              </List>
            </SelectedSectionsProvider>
          </ScrollPane>
        ) : (
          <NoSearchResults
            searchTerm={searchTerm}
            alertText="Please check the section exists."
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
            disabled={selectedSections.length === 0}
            onClick={() => handleSubmit(selectedSections)}
          >
            Select
          </Button>
        </ButtonGroup>
      </Footer>
    </StyledModal>
  );
};
SectionPicker.propTypes = {
  title: PropTypes.string.isRequired,
  sections: PropTypes.array.isRequired, // eslint-disable-line
  startingSelectedSections: PropTypes.array, // eslint-disable-line
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

export default SectionPicker;
