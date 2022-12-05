import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { Field } from "./elements";
import { colors } from "constants/theme";

const Legend = styled.div`
  font-weight: bold;
`;

const SelectContainer = styled.div`
  font-size: 1em;
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

const OptionLabelContainer = styled.div`
  width: 20em;
  border: solid ${colors.grey};
  border-width: 0.5px 1px 1px 1px;
  box-shadow: 0 3px 3px 0 ${colors.grey};
`;

const OptionLabel = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  width: 20em;
  font-size: 1em;
  color: inherit;
  font-weight: inherit;
  padding: 0.7em 1em 0.7em 1em;
  margin: 0;
`;

const MissingOptionLabel = styled.div`
  border: 2px dashed ${colors.previewError};
  border-radius: 2px;
  padding-left: 0.5em;
  margin-top: ${(props) => !props.firstElement && `-0.5em`};
  margin-bottom: ${(props) => props.lastElement && `-0.5em`};
`;

const DisplayNameContent = styled.div`
  margin-bottom: 0.5em;
`;

const isLastMissingLabelElement = (index, options) => {
  let lastElement = false;

  // if index is not last option in array and the label of the option after index is not empty
  if (index !== options.length - 1 && options[index + 1].label !== "") {
    lastElement = true;
  }

  return lastElement;
};

const SelectAnswer = ({ answer }) => {
  const { displayName, description } = answer;

  return (
    <Field>
      <Legend>{displayName}</Legend>
      <DisplayNameContent>{description}</DisplayNameContent>

      <SelectContainer>
        Select an answer <Chevron id="select-chevron" />
      </SelectContainer>

      <OptionLabelContainer>
        {answer.options.map((option, index) =>
          option.label !== "" ? (
            <OptionLabel key={option.id}>{option.label}</OptionLabel>
          ) : (
            <OptionLabel key={option.id}>
              <MissingOptionLabel
                firstElement={index === 0}
                lastElement={isLastMissingLabelElement(index, answer.options)}
              >
                Missing label
              </MissingOptionLabel>
            </OptionLabel>
          )
        )}
      </OptionLabelContainer>
    </Field>
  );
};

SelectAnswer.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
};

export default SelectAnswer;
