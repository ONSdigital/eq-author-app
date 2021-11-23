import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { get, some } from "lodash";

import { colors } from "constants/theme";
import { Number, Select, Label } from "components/Forms";
import VisuallyHidden from "components/VisuallyHidden";

import {
  rightSideErrors,
  OPERATOR_REQUIRED,
} from "constants/validationMessages";
import ValidationError from "components/ValidationError";

const conditions = {
  SELECT: null,
  EQUAL: "Equal",
  NOT_EQUAL: "NotEqual",
  GREATER_THAN: "GreaterThan",
  LESS_THAN: "LessThan",
  GREATER_OR_EQUAL: "GreaterOrEqual",
  LESS_OR_EQUAL: "LessOrEqual",
};

export const Selector = styled(Select)`
  width: 195px;
  padding: 0.3em 2em 0.3em 0.5em;
`;

const Value = styled.div`
  flex: 1 1 auto;
  display: flex;
  margin-left: 1em;
  align-items: center;
  position: relative;
`;

const SecondaryConditionRoutingSelector = styled.div`
  display: flex;
  align-items: center;
`;

const StyledNumber = styled(Number)`
  width: 80px;
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

// const Input = styled.input.attrs({
//   type: "number",
// })`
//   padding: 0.4em;
// `;

class SecondaryConditionSelector extends React.Component {
  static propTypes = {
    expression: PropTypes.shape({
      id: PropTypes.string.isRequired,
      left: PropTypes.shape({
        type: PropTypes.string.isRequired,
      }).isRequired,
      right: PropTypes.shape({
        number: PropTypes.number,
      }),
    }).isRequired,
    onRightChange: PropTypes.func.isRequired,
    onConditionChange: PropTypes.func.isRequired,
    groupErrorMessage: PropTypes.string,
  };

  state = {
    number: get(this.props.expression, "right.number", null),
  };

  handleRightChange = ({ value }) => this.setState(() => ({ number: value }));

  handleRightBlur = () => {
    this.props.onRightChange({ customValue: { number: this.state.number } });
  };

  handleSecondaryConditionChange = ({ value }) => {
    this.props.onConditionChange("CountOf", value);
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
    console.log(`SecondaryConditionSelector expression`, expression);

    const hasError =
      expression.validationErrorInfo.errors.length > 0 || groupErrorMessage;

    console.log(
      `expression.validationErrorInfo.errors`,
      expression.validationErrorInfo.errors
    );

    return (
      <>
        <SecondaryConditionRoutingSelector>
          <VisuallyHidden>
            <Label htmlFor={`expression-secondaryCondition-${expression.id}`}>
              Operator
            </Label>
          </VisuallyHidden>
          <Selector
            id={`expression-secondaryCondition-${expression.id}`}
            onChange={this.handleSecondaryConditionChange}
            name="secondaryCondition-select"
            value={expression.secondaryCondition}
            data-test="secondaryCondition-selector"
          >
            {!expression.secondaryCondition && (
              <option value={conditions.SELECT}>Select an operator</option>
            )}
            <option value={conditions.EQUAL}>(=) Equal to</option>
            <option value={conditions.NOT_EQUAL}>(&ne;) Not equal to</option>
            <option value={conditions.GREATER_THAN}>(&gt;) More than</option>
            <option value={conditions.LESS_THAN}>(&lt;) Less than</option>
            <option value={conditions.GREATER_OR_EQUAL}>
              (&ge;) More than or equal to
            </option>
            <option value={conditions.LESS_OR_EQUAL}>
              (&le;) Less than or equal to
            </option>
          </Selector>
          {/* {expression.secondaryCondition !== conditions.SELECT && ( */}
          <>
            <Value>
              <VisuallyHidden>
                <Label htmlFor={`expression-right-${expression.id}`}>
                  Value
                </Label>
              </VisuallyHidden>
              <StyledNumber
                default={null}
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
                unit={get(expression.left, "properties.unit", null)}
              />
            </Value>
          </>
          {/* )} */}
        </SecondaryConditionRoutingSelector>
        {hasError && this.handleError()}
      </>
    );
  }
}

export default SecondaryConditionSelector;
