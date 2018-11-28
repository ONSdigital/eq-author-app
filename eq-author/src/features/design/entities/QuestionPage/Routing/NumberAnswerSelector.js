import React from "react";
import styled from "styled-components";
import { colors, radius } from "constants/theme";
import { Number, Select, Label } from "components/Forms";
import PropTypes from "prop-types";
import { CURRENCY } from "constants/answer-types";
import CustomPropTypes from "custom-prop-types";
import VisuallyHidden from "components/VisuallyHidden";

export const RoutingNumberInput = styled(Number)`
  border-radius: ${radius};
  width: 8em;
  outline: none;
  ${props =>
    props.answerType === CURRENCY &&
    `
    padding-left: 1.2em;
  `};
`;

export const ComparatorSelector = styled(Select)`
  width: auto;
`;

const Value = styled.div`
  flex: 1 1 auto;
  display: flex;
  margin-left: 1em;
  align-items: center;
  position: relative;
`;

const CurrencySymbol = styled.div`
  position: absolute;
  opacity: 0.5;
  left: 0.5em;
`;

const NumberAnswerRoutingSelector = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${colors.lightGrey};
  margin: 1em 0;
  border-radius: ${radius};
  padding: 1em;
`;

const NumberAnswerValueSelector = ({
  condition,
  onComparatorChange,
  handleValueChange
}) => {
  const otherProps = {
    questionPageId: condition.questionPage.id
  };

  return (
    <NumberAnswerRoutingSelector>
      <VisuallyHidden>
        <Label
          htmlFor={`routing-condition-comparator-${condition.routingValue.id}`}
        >
          Operator
        </Label>
      </VisuallyHidden>
      <ComparatorSelector
        id={`routing-condition-comparator-${condition.routingValue.id}`}
        onChange={value => onComparatorChange(otherProps, value)}
        name="comparator-select"
        value={condition.comparator}
        data-test="comparator-selector"
      >
        <option value="Equal">(=) Equal to</option>
        <option value="NotEqual">(&ne;) Not equal to</option>
        <option value="GreaterThan">(&gt;) More than</option>
        <option value="LessThan">(&lt;) Less than</option>
        <option value="GreaterOrEqual">(&ge;) More than or equal to</option>
        <option value="LessOrEqual">(&le;) Less than or equal to</option>
      </ComparatorSelector>
      <Value>
        <VisuallyHidden>
          <Label
            htmlFor={`routing-condition-value-${condition.routingValue.id}`}
          >
            Value
          </Label>
        </VisuallyHidden>
        {condition.answer.type === CURRENCY && (
          <CurrencySymbol>£</CurrencySymbol>
        )}
        <RoutingNumberInput
          id={`routing-condition-value-${condition.routingValue.id}`}
          min={-99999999}
          max={999999999}
          placeholder="Value"
          value={condition.routingValue.numberValue}
          name={condition.routingValue.id}
          onChange={handleValueChange}
          data-test="number-value-input"
          answerType={condition.answer.type}
        />
      </Value>
    </NumberAnswerRoutingSelector>
  );
};

NumberAnswerValueSelector.propTypes = {
  condition: PropTypes.shape({
    id: PropTypes.string.isRequired,
    comparator: PropTypes.string.isRequired,
    questionPage: PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string
    }),
    answer: CustomPropTypes.answer,
    routingValue: PropTypes.shape({
      id: PropTypes.string,
      value: PropTypes.array,
      numberValue: PropTypes.number
    })
  }).isRequired,
  onComparatorChange: PropTypes.func.isRequired,
  handleValueChange: PropTypes.func.isRequired
};

export default NumberAnswerValueSelector;
