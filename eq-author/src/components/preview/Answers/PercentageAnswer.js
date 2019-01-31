import PropTypes from "prop-types";
import React from "react";

import { Field, UnitInput, Label } from "./elements";

const PercentageAnswer = ({ answer }) => (
  <Field>
    <Label description={answer.description}>{answer.label}</Label>
    <UnitInput unit="%" trailing />
  </Field>
);

PercentageAnswer.propTypes = {
  answer: PropTypes.shape({
    description: PropTypes.string,
    label: PropTypes.string,
  }).isRequired,
};

export default PercentageAnswer;
