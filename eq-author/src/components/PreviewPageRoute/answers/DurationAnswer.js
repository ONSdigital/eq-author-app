import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import { Field, Input, Label } from "./elements";
import { colors } from "constants/theme";

const InputType = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 10em;
  &:not(:first-of-type) {
    margin-left: 1em;
  }
`;

const Type = styled.div`
  display: inline-block;
  background-color: ${colors.lighterGrey};
  border-left: 1px solid ${colors.grey};
  border-radius: 0 3px 3px 0;
  padding: 0.6em 1em;
  font-weight: 600;
  font-size: 1em;
  text-align: center;
  line-height: normal;
  position: absolute;
  right: 1px;
  top: 1px;
  z-index: 4;
  text-decoration: none;
`;

const FieldGroup = styled.div`
  display: flex;
`;

const SmallInput = styled(Input)`
  width: 10em;
`;

const NumberAnswer = ({ answer }) => {
  const { char } = answer.properties.unit;

  const units = char.split("/");

  return (
    <Field>
      <Label description={answer.description}>{answer.label}</Label>
      <FieldGroup>
        {units.map((unit, index) => (
          <InputType key={index}>
            <SmallInput type="text" />
            {unit && <Type dangerouslySetInnerHTML={{ __html: unit }} />}
          </InputType>
        ))}
      </FieldGroup>
    </Field>
  );
};

NumberAnswer.propTypes = {
  answer: PropTypes.shape({
    description: PropTypes.string,
    label: PropTypes.string
  }).isRequired
};

export default NumberAnswer;
