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
  BEFORE: "Before",
  AFTER: "After",
  UNANSWERED: "Unanswered",
};

export const ConditionSelector = styled(Select)`
  width: 8em;
  flex: 1 1 auto;
  display: flex;
  position: relative;
`;

const Value = styled.div`
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  position: relative;
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
  margin-left: 1em;
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
      }),
    }).isRequired,
    onRightChange: PropTypes.func.isRequired,
    onConditionChange: PropTypes.func.isRequired,
    groupErrorMessage: PropTypes.string,
  };

  state = {
    offset: get(this.props.expression, "right.offset", null),
  };

  handleRightChange = ({ value }) => this.setState(() => ({ offset: value }));

  handleRightBlur = () => {
    this.props.onRightChange({
      dateValue: {
        offset: this.state.offset,
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
          {expression.condition !== conditions.UNANSWERED &&
            expression.condition !== conditions.SELECT && (
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
                    onChange={this.handleRightChange}
                    onBlur={this.handleRightBlur}
                    data-test="number-value-input"
                    type="Number"
                    unit={get(expression.left, "properties.unit", null)}
                  />
                  <RuleText>years</RuleText>
                </Value>
              </>
            )}
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
            <option value={conditions.BEFORE}> Before</option>
            <option value={conditions.AFTER}> After</option>
            <option value={conditions.UNANSWERED}> Unanswered</option>
          </ConditionSelector>
          <RuleText>response date</RuleText>
        </DateAnswerRoutingSelector>
        {hasError && this.handleError()}
      </>
    );
  }
}

export default DateAnswerSelector;
