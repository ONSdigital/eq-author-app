import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { Field } from "./elements";
import { colors } from "constants/theme";

const Legend = styled.div`
  font-weight: bold;
  margin-bottom: 0.5em;
`;

const SelectContainer = styled.div`
  font-size: 1em;
  background: #fff;
  border: 1px solid ${colors.grey};
  border-radius: 0.2em;
  width: fit-content;
  min-width: 20em;
  max-width: 100%;
  display: block;
  overflow: hidden;
  position: relative;
  word-wrap: break-word;
  padding: 0.5em;

  #select-chevron {
    float: right;
  }
`;

const Chevron = styled.span`
  &:before {
    border-style: solid;
    border-radius: 3px;
    border-width: 0.25em 0.25em 0 0;
    content: "";
    display: inline-block;
    height: 1em;
    right: 0.15em;
    position: relative;
    transform: rotate(135deg);
    vertical-align: top;
    width: 1em;
  }
`;

const SelectAnswer = ({ answer }) => {
  return (
    <Field>
      <Legend>Select codes</Legend>

      <SelectContainer>
        Select an option <Chevron id="select-chevron" />
      </SelectContainer>

      {/* {answer.options.map((option, index) => (
        <Option
          key={option.id || index}
          option={option}
          type={answer.type}
          answer={option.additionalAnswer}
          answerOptions={answer.options}
        />
      ))} */}
    </Field>
  );
};

export default SelectAnswer;
