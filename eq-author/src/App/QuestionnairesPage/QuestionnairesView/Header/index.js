import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { debounce } from "lodash";

import Button from "components/buttons/Button";
import { Input } from "components/Forms";
import VisuallyHidden from "components/VisuallyHidden";
import AccessFilter from "./AccessFilter";

import { colors } from "constants/theme";

import QuestionnaireSettingsModal from "App/QuestionnaireSettingsModal";

import iconSearch from "./icon-search.svg";

const DEBOUNCE_TIMEOUT = 200;

const Wrapper = styled.div`
  margin: 1em 0;
  display: flex;
  z-index: 1;
  align-items: center;
  justify-content: space-between;
`;

const Search = styled.div`
  position: relative;
  &::before {
    content: url(${iconSearch});
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

const Header = ({
  onCreateQuestionnaire,
  onSearchChange,
  onToggleFilter,
  isFiltered,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const onSearchChangeDebounced = useMemo(() => {
    return debounce(({ value }) => onSearchChange(value), DEBOUNCE_TIMEOUT);
  }, [onSearchChange]);

  return (
    <>
      <Wrapper>
        <Search>
          <VisuallyHidden>
            <label htmlFor="search">Search</label>
          </VisuallyHidden>
          <SearchInput
            id="search"
            defaultValue={""}
            onChange={onSearchChangeDebounced}
          />
        </Search>

        <AccessFilter onToggleFilter={onToggleFilter} isFiltered={isFiltered} />

        <Button
          onClick={handleModalOpen}
          primary
          data-test="create-questionnaire"
        >
          Create questionnaire
        </Button>
      </Wrapper>
      <QuestionnaireSettingsModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={onCreateQuestionnaire}
        confirmText="Create"
      />
    </>
  );
};

Header.propTypes = {
  onCreateQuestionnaire: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onToggleFilter: PropTypes.func.isRequired,
  isFiltered: PropTypes.bool.isRequired,
};

export default Header;
