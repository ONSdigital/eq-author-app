import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { debounce } from "lodash";

import Button from "components/buttons/Button";
import SearchBar from "components/SearchBar";
import AccessFilter from "./AccessFilter";

import QuestionnaireSettingsModal from "App/QuestionnaireSettingsModal";

const DEBOUNCE_TIMEOUT = 200;

const Wrapper = styled.div`
  margin: 1em 0 1.5em;
  display: flex;
  z-index: 1;
  align-items: center;
  justify-content: space-between;
`;

const Header = ({
  onCreateQuestionnaire,
  onSearchChange,
  onToggleFilter,
  isFiltered,
  canCreateQuestionnaire = true,
  padding,
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
        <SearchBar onChange={onSearchChangeDebounced} paddingType={padding} />
        <AccessFilter
          onToggleFilter={onToggleFilter}
          isFiltered={isFiltered}
          paddingType={padding}
        />

        {canCreateQuestionnaire && (
          <Button
            onClick={handleModalOpen}
            primary
            data-test="create-questionnaire"
          >
            Create questionnaire
          </Button>
        )}
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
  onToggleFilter: PropTypes.func.isRequired,
  isFiltered: PropTypes.bool.isRequired,
  canCreateQuestionnaire: PropTypes.bool,
  padding: PropTypes.string,
};

export default Header;
