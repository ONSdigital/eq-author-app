import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { debounce } from "lodash";

import Theme from "contexts/themeContext";
import Button from "components-themed/buttons/button";
import SearchBar from "components/SearchBar";
import { colors } from "constants/theme";

import QuestionnaireSettingsModal from "App/QuestionnaireSettingsModal";

const DEBOUNCE_TIMEOUT = 200;

const Title = styled.h1`
  text-color: ${colors.black};
`;

const CreateQuestionnaireButton = styled(Button)`
  height: fit-content;
  margin-left: 1.5em;
  .button-text {
    padding: 0.6em 0.7em;
  }
`;

const Wrapper = styled.div`
  margin: 1em 0 1.5em;
  display: flex;
  z-index: 1;
  align-items: left;
  justify-content: start;
`;

const Header = ({
  onCreateQuestionnaire,
  onSearchChange,
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
      <Title>Questionnaires</Title>
      <Wrapper>
        <SearchBar onChange={onSearchChangeDebounced} paddingType={padding} />

        {canCreateQuestionnaire && (
          <Theme themeName={"ons"}>
            <CreateQuestionnaireButton
              onClick={handleModalOpen}
              data-test="create-questionnaire"
            >
              Create questionnaire
            </CreateQuestionnaireButton>
          </Theme>
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
  canCreateQuestionnaire: PropTypes.bool,
  padding: PropTypes.string,
};

export default Header;
