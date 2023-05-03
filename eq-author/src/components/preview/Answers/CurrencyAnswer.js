import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import { colors } from "constants/theme";
import { Field, UnitInput, Label } from "./elements";

const Wrapper = styled.div`
  ${(props) =>
    props.active &&
    `
      border: 2px dashed ${colors.previewError};
      border-radius: 0.2em;
      padding: 1em;
      width: fit-content;`}
`;

const CurrencyAnswer = ({ answer }) => {
  const { repeatingLabelAndInput } = answer;

  return (
    <Field>
      {repeatingLabelAndInput && (
        <Label color={colors.primary}>Repeating label and input</Label>
      )}
      <Wrapper active={repeatingLabelAndInput}>
        <Label description={answer.description}>{answer.label}</Label>
        <UnitInput unit="£" />
      </Wrapper>
    </Field>
  );
};

CurrencyAnswer.propTypes = {
  answer: PropTypes.shape({
    description: PropTypes.string,
    label: PropTypes.string,
  }).isRequired,
};

export default CurrencyAnswer;
