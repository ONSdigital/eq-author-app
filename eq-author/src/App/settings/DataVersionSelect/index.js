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

const dataVersionOptions = [
  {
    value: "1",
    title: "Data version 1",
    description:
      "Enables downstream processing of older questionnaires without complex features",
  },
  {
    value: "3",
    title: "Data version 3",
    description:
      "Enables downstream processing of newer questionnaires with complex features",
  },
];

const DataVersionOption = ({
  questionnaireId,
  value,
  selected,
  dataVersionThreeRequired,
  children,
}) => {
  const [updateQuestionnaire] = useMutation(UPDATE_QUESTIONNAIRE_MUTATION);
  return (
    <StyledRadioLabel
      selected={selected}
      disabled={value !== "3" && dataVersionThreeRequired}
    >
      <Input
        id={`data-version-input-${value}`}
        type="radio"
        variant="radioBox"
        checked={selected}
        disabled={value !== "3" && dataVersionThreeRequired}
        onChange={() =>
          updateQuestionnaire({
            variables: { input: { id: questionnaireId, dataVersion: value } },
          })
        }
      />
      {children}
    </StyledRadioLabel>
  );
};

const DataVersionSelect = ({
  questionnaireId,
  selectedDataVersion,
  dataVersionThreeRequired,
}) => {
  return (
    <RadioField>
      {dataVersionOptions.map(({ value, title, description }) => (
        <DataVersionOption
          key={title}
          value={value}
          selected={value === selectedDataVersion}
          questionnaireId={questionnaireId}
          dataVersionThreeRequired={dataVersionThreeRequired}
        >
          <StyledRadioTitle>{title}</StyledRadioTitle>
          <RadioDescription>{description}</RadioDescription>
        </DataVersionOption>
      ))}
    </RadioField>
  );
};

DataVersionOption.propTypes = {
  questionnaireId: PropTypes.string,
  value: PropTypes.string,
  selected: PropTypes.bool,
  dataVersionThreeRequired: PropTypes.bool,
  children: PropTypes.node,
};

DataVersionSelect.propTypes = {
  questionnaireId: PropTypes.string,
  shortName: PropTypes.string,
  selectedDataVersion: PropTypes.string,
  dataVersionThreeRequired: PropTypes.bool,
};

export default DataVersionSelect;
