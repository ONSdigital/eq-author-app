import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

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

const SingleDuration = ({ answer }) => (
  <Field>
    <Label description={answer.description}>{answer.label}</Label>
    <UnitInput
      unit={durationConversion[answer.properties.unit].abbreviation}
      trailing
    />
  </Field>
);

SingleDuration.propTypes = {
  answer: PropTypes.shape({
    description: PropTypes.string,
    label: PropTypes.string,
    properties: PropTypes.shape({
      unit: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

const MultipleDuration = ({ answer }) => (
  <Field>
    <Label description={answer.description}>{answer.label}</Label>
    <DurationField>
      <DurationInput>
        <UnitInput unit={durationConversion[YEARS].abbreviation} trailing />
      </DurationInput>
      <DurationInput>
        <UnitInput unit={durationConversion[MONTHS].abbreviation} trailing />
      </DurationInput>
    </DurationField>
  </Field>
);

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
