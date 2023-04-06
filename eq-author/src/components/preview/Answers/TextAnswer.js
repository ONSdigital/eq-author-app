import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import { colors } from "constants/theme";
import { Field, Input, Label } from "./elements";

const TextInput = styled(Input)`
  width: 20em;
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

const TextAnswer = ({ answer }) => {
  const { repeatingLabelAndInput } = answer;

  return (
    <Field>
      {repeatingLabelAndInput && (
        <Label color={colors.primary}>Repeating label and input</Label>
      )}
      <Wrapper active={repeatingLabelAndInput}>
        <Label description={answer.description}>{answer.label}</Label>
        <TextInput type="text" />
      </Wrapper>
    </Field>
  );
};

TextAnswer.propTypes = {
  answer: PropTypes.shape({
    description: PropTypes.string,
    label: PropTypes.string,
  }).isRequired,
};

export default TextAnswer;
