import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import { colors } from "constants/theme";
import { Field, UnitInput, Label } from "./elements";
import {
  YEARSMONTHS,
  YEARS,
  MONTHS,
  durationConversion,
} from "constants/duration-types";

const DurationField = styled.div`
  display: flex;
`;

const DurationInput = styled.div`
  margin-right: 1em;
`;

const Wrapper = styled.div`
  ${(props) =>
    props.active &&
    `
      border: 2px dashed ${colors.previewError};
      border-radius: 0.2em;
      padding: 1em;
      width: fit-content;`}
`;

const SingleDuration = ({ answer }) => {
  const { repeatingLabelAndInput } = answer;

  return (
    <Field>
      {repeatingLabelAndInput && (
        <Label color={colors.primary}>Repeating label and input</Label>
      )}
      <Wrapper active={repeatingLabelAndInput}>
        <Label description={answer.description}>{answer.label}</Label>
        <UnitInput
          unit={durationConversion[answer.properties.unit].abbreviation}
          trailing
        />
      </Wrapper>
    </Field>
  );
};

SingleDuration.propTypes = {
  answer: PropTypes.shape({
    description: PropTypes.string,
    label: PropTypes.string,
    properties: PropTypes.shape({
      unit: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

const MultipleDuration = ({ answer }) => {
  const { repeatingLabelAndInput } = answer;
  return (
    <Field>
      {repeatingLabelAndInput && (
        <Label color={colors.primary}>Repeating label and input</Label>
      )}
      <Wrapper active={repeatingLabelAndInput}>
        <Label description={answer.description}>{answer.label}</Label>
        <DurationField>
          <DurationInput>
            <UnitInput unit={durationConversion[YEARS].abbreviation} trailing />
          </DurationInput>
          <DurationInput>
            <UnitInput
              unit={durationConversion[MONTHS].abbreviation}
              trailing
            />
          </DurationInput>
        </DurationField>
      </Wrapper>
    </Field>
  );
};

MultipleDuration.propTypes = {
  answer: PropTypes.shape({
    description: PropTypes.string,
    label: PropTypes.string,
    properties: PropTypes.shape({
      unit: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

const DurationAnswer = ({ answer }) =>
  answer.properties.unit === YEARSMONTHS ? (
    <MultipleDuration answer={answer} />
  ) : (
    <SingleDuration answer={answer} />
  );

DurationAnswer.propTypes = {
  answer: PropTypes.shape({
    description: PropTypes.string,
    label: PropTypes.string,
    properties: PropTypes.shape({
      unit: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default DurationAnswer;
