import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import { Field, Input, Label } from "./elements";

const TextInput = styled(Input)`
  width: 20em;
`;

const TextAnswer = ({ answer }) => (
  <Field>
    <Label description={answer.description}>{answer.label}</Label>
    <TextInput type="text" />
  </Field>
);

TextAnswer.propTypes = {
  answer: PropTypes.shape({
    description: PropTypes.string,
    label: PropTypes.string,
  }).isRequired,
};

export default TextAnswer;
