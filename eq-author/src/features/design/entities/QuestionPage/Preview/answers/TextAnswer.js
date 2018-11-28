import PropTypes from "prop-types";
import React from "react";

import { Field, Input, Label } from "./elements";

const TextAnswer = ({ answer }) => (
  <Field>
    <Label description={answer.description}>{answer.label}</Label>
    <Input type="text" />
  </Field>
);

TextAnswer.propTypes = {
  answer: PropTypes.shape({
    description: PropTypes.string,
    label: PropTypes.string
  }).isRequired
};

export default TextAnswer;
