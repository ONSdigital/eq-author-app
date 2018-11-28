/* eslint-disable react/jsx-no-bind */

import React from "react";
import styled from "styled-components";

import ToggleChip from "components/ToggleChip";
import { includes, get } from "lodash";

import { PropTypes } from "prop-types";

const MultipleChoiceAnswerOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 1em 0;
`;

const MultipleChoiceAnswerOptionsSelector = ({
  condition,
  onOptionSelectionChange
}) => {
  const answerOptions = get(condition, "answer.options", []);
  const answerOtherOption = get(condition, "answer.other.option");
  const options = answerOtherOption
    ? answerOptions.concat(answerOtherOption)
    : answerOptions;

  const selectedOptions = get(condition, "routingValue.value", []);

  return (
    <MultipleChoiceAnswerOptions data-test="options-selector">
      {options.map(option => (
        <ToggleChip
          key={option.id}
          name={option.id}
          title={option.label}
          checked={includes(selectedOptions, option.id)}
          onChange={({ name, value }) =>
            onOptionSelectionChange(condition.id, name, value)
          }
        >
          {option.label || <strong>Unlabelled option</strong>}
        </ToggleChip>
      ))}
    </MultipleChoiceAnswerOptions>
  );
};

MultipleChoiceAnswerOptionsSelector.propTypes = {
  condition: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  onOptionSelectionChange: PropTypes.func.isRequired
};

export default MultipleChoiceAnswerOptionsSelector;
