import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useMutation } from "@apollo/react-hooks";
import { colors } from "constants/theme.js";

import { Input } from "components/Forms";
import {
  RadioLabel,
  RadioField,
  RadioDescription as RadioTitle,
} from "components/Radio";

import UPDATE_QUESTIONNAIRE_MUTATION from "graphql/updateQuestionnaire.graphql";

import DATA_VERSION_OPTIONS from "constants/data-version-options";

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

const Caption = styled.p`
  margin-top: 0.2em;
  margin-bottom: 0.6em;
  font-size: 0.85em;
`;

const StyledFieldset = styled.fieldset`
  border: none;
  padding: 0;
  margin: 0;
`;

const StyledLegend = styled.legend`
  display: block;
  padding: 0;
  font-weight: bold;
  color: ${colors.text};
  line-height: 1.3;
`;

const DataVersionOption = ({
  questionnaireId,
  value,
  selected,
  allowableDataVersions,
  children,
}) => {
  const [updateQuestionnaire] = useMutation(UPDATE_QUESTIONNAIRE_MUTATION);
  return (
    <StyledRadioLabel
      selected={selected}
      disabled={!allowableDataVersions?.includes(value)}
    >
      <Input
        id={`data-version-input-${value}`}
        type="radio"
        variant="radioBox"
        checked={selected}
        disabled={!allowableDataVersions?.includes(value)}
        onChange={() =>
          updateQuestionnaire({
            variables: { input: { id: questionnaireId, dataVersion: value } },
          })
        }
        data-test={`data-version-input-${value}`}
      />
      {children}
    </StyledRadioLabel>
  );
};

const DataVersionSelect = ({
  questionnaireId,
  selectedDataVersion,
  allowableDataVersions,
}) => {
  return (
    <StyledFieldset>
      <StyledLegend>Data version</StyledLegend>
      <Caption>
        There are two processing methods for questionnaire data: data version 1
        and data version 3.
      </Caption>
      <RadioField>
        {DATA_VERSION_OPTIONS.map(({ value, title, description }) => (
          <DataVersionOption
            key={title}
            value={value}
            selected={value === selectedDataVersion}
            questionnaireId={questionnaireId}
            allowableDataVersions={allowableDataVersions}
          >
            <StyledRadioTitle>{title}</StyledRadioTitle>
            <RadioDescription>{description}</RadioDescription>
          </DataVersionOption>
        ))}
      </RadioField>
    </StyledFieldset>
  );
};

DataVersionOption.propTypes = {
  questionnaireId: PropTypes.string,
  value: PropTypes.string,
  selected: PropTypes.bool,
  allowableDataVersions: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node,
};

DataVersionSelect.propTypes = {
  questionnaireId: PropTypes.string,
  shortName: PropTypes.string,
  selectedDataVersion: PropTypes.string,
  allowableDataVersions: PropTypes.arrayOf(PropTypes.string),
};

export default DataVersionSelect;
