import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { get } from "lodash";

import { colors, radius } from "constants/theme";
import { Number, Select, Label } from "components/Forms";
import VisuallyHidden from "components/VisuallyHidden";

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

  state = {
    number: get(this.props.expression, "right.number", null),
  };

  handleRightChange = ({ value }) => this.setState(() => ({ number: value }));

  handleRightBlur = () => {
    this.props.onRightChange({ customValue: { number: this.state.number } });
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
          <Number
            id={`expression-right-${expression.id}`}
            min={-99999999}
            max={999999999}
            placeholder="Value"
            value={this.state.number}
            name={`expression-right-${expression.id}`}
            onChange={this.handleRightChange}
            onBlur={this.handleRightBlur}
            data-test="number-value-input"
            type={expression.left.type}
          />
        </Value>
      </NumberAnswerRoutingSelector>
    );
  }
}

export default NumberAnswerSelector;
