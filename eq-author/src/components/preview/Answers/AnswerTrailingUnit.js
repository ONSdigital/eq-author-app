import PropTypes from "prop-types";
import React from "react";

import { Field, UnitInput, Label } from "./elements";
import { PERCENTAGE } from "constants/answer-types";
import { unitConversion } from "constants/unit-types";

const getUnit = (answer) => {
  if (answer.type === PERCENTAGE) {
    return "%";
  }
  if (!answer.properties.unit) {
    return "Missing unit";
  }
  return unitConversion[answer.properties.unit].abbreviation;
};

const AnswerTrailingUnit = ({ answer }) => (
  <Field>
    <Label description={answer.description}>{answer.label}</Label>
    <UnitInput unit={getUnit(answer)} trailing />
  </Field>
);

AnswerTrailingUnit.propTypes = {
  answer: PropTypes.shape({
    description: PropTypes.string,
    label: PropTypes.string,
  }).isRequired,
};

export default AnswerTrailingUnit;
