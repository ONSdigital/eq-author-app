import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useMutation } from "@apollo/react-hooks";
import { colors } from "constants/theme";

import {
  RadioLabel,
  RadioField,
  RadioDescription as RadioTitle,
} from "components/Radio";
import { Input } from "components/Forms";

import THEMES from "constants/themes";

import UPDATE_QUESTIONNAIRE_MUTATION from "graphql/updateQuestionnaire.graphql";

const StyledRadioTitle = styled(RadioTitle)`
  font-size: 1em;
  letter-spacing: 0;
  margin-left: 2.3em;
  color: ${colors.text};
  margin-bottom: 0.3em;
`;

const RadioDescription = styled.span`
  font-size: 0.8em;
  letter-spacing: 0;
  margin-left: 2.9em;
  color: ${colors.text};
`;

const StyledRadioLabel = styled(RadioLabel)`
  min-width: 22.5em;
  width: fit-content;
`;

const ThemeOption = ({
  questionnaireId,
  themeId,
  selected,
  dataTest,
  children,
}) => {
  const [updateQuestionnaire] = useMutation(UPDATE_QUESTIONNAIRE_MUTATION);

  return (
    <StyledRadioLabel data-test={dataTest}>
      <Input
        id={themeId}
        type="radio"
        variant="radioBox"
        checked={selected}
        onChange={() =>
          updateQuestionnaire({
            variables: { input: { id: questionnaireId, theme: themeId } },
          })
        }
      />
      {children}
    </StyledRadioLabel>
  );
};

const ThemeSelect = ({ questionnaireId, selectedTheme }) => {
  return (
    <RadioField>
      {THEMES.map(({ id, title, description }) => (
        <ThemeOption
          key={id}
          themeId={id}
          selected={id === selectedTheme} // Theme option is selected if its ID matches the ID of the theme from the questionnaire data
          questionnaireId={questionnaireId}
          dataTest={`theme-option-${id}`}
        >
          <StyledRadioTitle>{title}</StyledRadioTitle>
          <RadioDescription>{description}</RadioDescription>
        </ThemeOption>
      ))}
    </RadioField>
  );
};

ThemeOption.propTypes = {
  questionnaireId: PropTypes.string,
  themeId: PropTypes.string,
  selected: PropTypes.bool,
  dataTest: PropTypes.string,
  children: PropTypes.node,
};

ThemeSelect.propTypes = {
  questionnaireId: PropTypes.string,
  selectedTheme: PropTypes.string,
};

export default ThemeSelect;
