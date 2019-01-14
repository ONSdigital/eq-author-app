import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { get } from "lodash/fp";

import { colors, radius } from "constants/theme";
import { CURRENCY } from "constants/answer-types";
import { Number, Select, Label } from "components/Forms";
import VisuallyHidden from "components/VisuallyHidden";

export const RoutingNumberInput = styled(Number)`
  border-radius: ${radius};
  width: 8em;
  outline: none;
  ${props => props.answerType === CURRENCY && "padding-left: 1.2em;"}
`;

export const ConditionSelector = styled(Select)`
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

class NumberAnswerSelector extends React.Component {
  static propTypes = {
    expression: PropTypes.shape({
      id: PropTypes.string.isRequired,
      left: PropTypes.shape({
        type: PropTypes.string.isRequired,
      }).isRequired,
      right: PropTypes.shape({
        number: PropTypes.number.isRequired,
      }),
    }).isRequired,
    onRightChange: PropTypes.func.isRequired,
    onConditionChange: PropTypes.func.isRequired,
  };

  handleRightChange = ({ value }) => {
    this.props.onRightChange({ customValue: { number: value } });
  };

  handleConditionChange = ({ value }) => {
    this.props.onConditionChange(value);
  };

  render() {
    const { expression } = this.props;
    return (
      <NumberAnswerRoutingSelector>
        <VisuallyHidden>
          <Label htmlFor={`expression-condition-${expression.id}`}>
            Operator
          </Label>
        </VisuallyHidden>
        <ConditionSelector
          id={`expression-condition-${expression.id}`}
          onChange={this.handleConditionChange}
          name="condition-select"
          value={expression.condition}
          data-test="condition-selector"
        >
          <option value="Equal">(=) Equal to</option>
          <option value="NotEqual">(&ne;) Not equal to</option>
          <option value="GreaterThan">(&gt;) More than</option>
          <option value="LessThan">(&lt;) Less than</option>
          <option value="GreaterOrEqual">(&ge;) More than or equal to</option>
          <option value="LessOrEqual">(&le;) Less than or equal to</option>
        </ConditionSelector>
        <Value>
          <VisuallyHidden>
            <Label htmlFor={`expression-right-${expression.id}`}>Value</Label>
          </VisuallyHidden>
          {expression.left.type === CURRENCY && (
            <CurrencySymbol>£</CurrencySymbol>
          )}
          <RoutingNumberInput
            id={`expression-right-${expression.id}`}
            min={-99999999}
            max={999999999}
            placeholder="Value"
            value={get("right.number", expression)}
            name={`expression-right-${expression.id}`}
            onChange={this.handleRightChange}
            data-test="number-value-input"
            answerType={expression.left.type}
          />
        </Value>
      </NumberAnswerRoutingSelector>
    );
  }
}

export default NumberAnswerSelector;
