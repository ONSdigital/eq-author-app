import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { get, some } from "lodash";

import { colors, radius } from "constants/theme";
import { Number, Select, Label } from "components/Forms";
import VisuallyHidden from "components/VisuallyHidden";

import {
  rightSideErrors,
  OPERATOR_REQUIRED,
} from "constants/validationMessages";
import ValidationError from "components/ValidationError";

const conditions = {
  SELECT: null,
  BEFORE: "Before",
  AFTER: "After",
  LESS_THAN: "LessThan",
  GREATER_THAN: "GreaterThan",
};

export const ConditionSelector = styled(Select)`
  width: ${(props) => (props.name === "left-condition-select" ? `7em` : `5em`)};
  flex: 1 1 auto;
  display: flex;
  position: relative;
  margin-right: 1em;
  max-width: 15em;
`;

export const OffsetSelector = styled(Select)`
  width: ${(props) => (props.name === "left-condition-select" ? `7em` : `5em`)};
  flex: 1 1 auto;
  display: flex;
  position: relative;
  margin-right: 1em;
  max-width: 15em;
`;

const Value = styled.div`
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  position: relative;
  width: 3em;
  margin-right: 1em;
`;

const DateAnswerRoutingSelector = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${colors.lightGrey};
  margin: 1em 0;
  border-radius: ${radius};
  padding: 1em;
  ${({ hasError }) =>
    hasError &&
    `
    border-color: ${colors.errorPrimary};
    outline-color: ${colors.errorPrimary};
    box-shadow: 0 0 0 2px ${colors.errorPrimary};
    border-radius: 4px;
    margin-bottom: 0.5em;
  `}
`;

const RuleText = styled.div`
  margin-right: 1em;
`;

class DateAnswerSelector extends React.Component {
  static propTypes = {
    expression: PropTypes.shape({
      id: PropTypes.string.isRequired,
      left: PropTypes.shape({
        type: PropTypes.string.isRequired,
      }).isRequired,
      right: PropTypes.shape({
        offset: PropTypes.number,
        offsetDirection: PropTypes.string,
      }),
    }).isRequired,
    onRightChange: PropTypes.func.isRequired,
    onConditionChange: PropTypes.func.isRequired,
    groupErrorMessage: PropTypes.string,
  };

  state = {
    offset: get(this.props.expression, "right.offset", null),
    offsetDirection: get(this.props.expression, "right.offsetDirection", null),
  };

  handleOffsetChange = ({ value }) => this.setState({ offset: value });

  handleOffsetDirectionChange = ({ value }) => {
    this.setState({ offsetDirection: value });
    this.props.onRightChange({
      dateValue: {
        offset: this.state.offset,
        offsetDirection: value,
      },
    });
  };

  handleRightBlur = () => {
    this.props.onRightChange({
      dateValue: {
        offset: this.state.offset,
        offsetDirection: this.state.offsetDirection,
      },
    });
  };

  handleConditionChange = ({ value }) => {
    this.props.onConditionChange(value);
  };

  handleError = () => {
    const { expression, groupErrorMessage } = this.props;
    let message = null;

    const errors = expression.validationErrorInfo.errors;

    if (errors.some(({ field }) => field === "condition")) {
      message = OPERATOR_REQUIRED;
    } else if (
      errors.some(
        ({ errorCode }) =>
          errorCode === rightSideErrors.ERR_RIGHTSIDE_NO_VALUE.errorCode
      )
    ) {
      message = rightSideErrors.ERR_RIGHTSIDE_NO_VALUE.message;
    }

    if (
      some(expression.validationErrorInfo.errors, {
        errorCode: rightSideErrors.ERR_RIGHTSIDE_NO_VALUE.errorCode,
      })
    ) {
      message = rightSideErrors.ERR_RIGHTSIDE_NO_VALUE.message;
    }

    if (
      some(expression.validationErrorInfo.errors, {
        errorCode: rightSideErrors.ERR_RIGHTSIDE_NO_CONDITION.errorCode,
      })
    ) {
      message = rightSideErrors.ERR_RIGHTSIDE_NO_CONDITION.message;
    }

    return <ValidationError>{message || groupErrorMessage}</ValidationError>;
  };

  render() {
    const { expression, groupErrorMessage } = this.props;

    const hasError =
      expression.validationErrorInfo.errors.length > 0 || groupErrorMessage;

    return (
      <>
        <DateAnswerRoutingSelector hasError={hasError}>
          <RuleText>is</RuleText>
          <VisuallyHidden>
            <Label htmlFor={`expression-condition-left-${expression.id}`}>
              Operator
            </Label>
          </VisuallyHidden>
          <ConditionSelector
            id={`expression-condition-left-${expression.id}`}
            onChange={this.handleConditionChange}
            name="left-condition-select"
            value={expression.condition}
            data-test="left-condition-selector"
          >
            {!expression.condition && (
              <option value={conditions.SELECT}>Select an operator</option>
            )}
            <option value={conditions.LESS_THAN}>(&lt;) Less than</option>
            <option value={conditions.GREATER_THAN}>(&gt;) More than</option>
          </ConditionSelector>
          {expression.condition !== conditions.SELECT && (
            <>
              <Value>
                <VisuallyHidden>
                  <Label htmlFor={`expression-right-${expression.id}`}>
                    Value
                  </Label>
                </VisuallyHidden>
                <Number
                  default={null}
                  id={`expression-right-${expression.id}`}
                  min={-99999999}
                  max={999999999}
                  placeholder="Value"
                  value={this.state.offset}
                  name={`expression-right-${expression.id}`}
                  onChange={this.handleOffsetChange}
                  onBlur={this.handleRightBlur}
                  data-test="number-value-input"
                  type="Number"
                  unit={get(expression.left, "properties.unit", null)}
                />
              </Value>
              <RuleText>years</RuleText>
              <VisuallyHidden>
                <Label htmlFor={`expression-condition-right-${expression.id}`}>
                  Operator
                </Label>
              </VisuallyHidden>
              <OffsetSelector
                id={`expression-condition-right-${expression.id}`}
                onChange={this.handleOffsetDirectionChange}
                name="right-condition-select"
                data-test="right-condition-selector"
                value={this.state.offsetDirection}
              >
                {(!expression.right || !expression.right.offsetDirection) && (
                  <option value={conditions.SELECT}>Select an operator</option>
                )}
                <option value={conditions.BEFORE}>Before</option>
                <option value={conditions.AFTER}>After</option>
              </OffsetSelector>
              <RuleText>response date</RuleText>
            </>
          )}
        </DateAnswerRoutingSelector>
        {hasError && this.handleError()}
      </>
    );
  }
}

export default DateAnswerSelector;
