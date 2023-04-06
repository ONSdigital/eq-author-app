import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import { colors } from "constants/theme";
import { Field, Label, Input } from "./elements";

const Textarea = styled(Input.withComponent("textarea"))`
  width: 30em;
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

const TextAreaAnswer = ({ answer }) => {
  const { repeatingLabelAndInput } = answer;

  return (
    <Field>
      {repeatingLabelAndInput && (
        <Label color={colors.primary}>Repeating label and input</Label>
      )}
      <Wrapper active={repeatingLabelAndInput}>
        <Label description={answer.description}>{answer.label}</Label>
        <Textarea cols="60" rows="8" />
      </Wrapper>
    </Field>
  );
};
TextAreaAnswer.propTypes = {
  answer: PropTypes.shape({
    description: PropTypes.string,
    label: PropTypes.string,
  }).isRequired,
};

export default TextAreaAnswer;
