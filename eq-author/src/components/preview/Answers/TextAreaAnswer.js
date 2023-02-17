import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import { Field, Label, Input } from "./elements";
import { stripHtmlToText } from "utils/stripHTML";

const Textarea = styled(Input.withComponent("textarea"))`
  width: 30em;
`;

const TextAreaAnswer = ({ answer }) => (
  <Field>
    <Label description={answer.description}>
      {stripHtmlToText(answer.label)}
    </Label>
    <Textarea cols="60" rows="8" />
  </Field>
);
TextAreaAnswer.propTypes = {
  answer: PropTypes.shape({
    description: PropTypes.string,
    label: PropTypes.string,
  }).isRequired,
};

export default TextAreaAnswer;
