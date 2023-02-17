import PropTypes from "prop-types";
import React from "react";

import { Field, UnitInput, Label } from "./elements";
import { stripHtmlToText } from "utils/stripHTML";

const CurrencyAnswer = ({ answer }) => (
  <Field>
    <Label description={answer.description}>
      {stripHtmlToText(answer.label)}
    </Label>
    <UnitInput unit="£" />
  </Field>
);
CurrencyAnswer.propTypes = {
  answer: PropTypes.shape({
    description: PropTypes.string,
    label: PropTypes.string,
  }).isRequired,
};

export default CurrencyAnswer;
