import React from "react";
import styled from "styled-components";
import { includes, get, find } from "lodash";
import { PropTypes, string } from "prop-types";
import { TransitionGroup } from "react-transition-group";

import CheckboxChip from "./CheckboxChip";
import CheckboxChipTransition from "./CheckboxChipTransition";
import CheckboxOptionPicker from "./CheckboxOptionPicker";
import Popover from "./CheckboxSelectorPopup";
import ValidationError from "components/ValidationError";

import {
  rightSideErrors,
  OPERATOR_REQUIRED,
  ERR_COUNT_OF_GREATER_THAN_AVAILABLE_OPTIONS,
} from "constants/validationMessages";
import { colors } from "constants/theme";
import { RADIO } from "constants/answer-types";
import { Select } from "components/Forms";

import TextButton from "components/buttons/TextButton";
import ToggleChip from "components/buttons/ToggleChip";
import SecondaryConditionSelector from "./SecondaryConditionSelector";
import { enableOn } from "utils/featureFlags";

const answerConditions = {
  UNANSWERED: "Unanswered",
  COUNTOF: "CountOf",
  ALLOF: "AllOf",
  ANYOF: "AnyOf",
  ONEOF: "OneOf",
  NOTANYOF: "NotAnyOf",
};

const MultipleChoiceAnswerOptions = styled.div`
  align-items: center;
  display: inline-flex;
  flex-flow: row wrap;
  width: 100%;
  margin-top: 0.75em;
  margin-bottom: 1em;
  padding: 0.5em;
  border-radius: 4px;
  border: 2px solid ${colors.lighterGrey};
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

const Label = styled.label`
  font-size: 1em;
  font-weight: bold;
  color: ${colors.textLight};
`;

const ConditionSelect = styled(Select)`
  display: inline-block;
  width: auto;
  margin: 0 0.5em;
  padding: 0.3em 2em 0.3em 0.5em;
  ${({ hasError }) => hasError && `border: thin solid #d0021b`}
`;

const ChooseButton = styled(TextButton)`
  font-size: 1rem;
  background: ${colors.white};
  padding: 0.3em 0.5em;
  border-radius: 4px;
  color: ${colors.primary};
  border: 1px solid ${colors.primary};
  display: inline-flex;
  align-items: center;
  margin: 0.25rem;
  max-width: 12em;
  letter-spacing: 0;

  &:hover {
    color: ${colors.white};
    background: ${colors.primary};
  }

  &:focus,
  &:active {
    outline-width: 0;
  }

  &:focus {
    box-shadow: 0 0 0 3px ${colors.tertiary};
    outline: none;
  }
`;

const SelectedOptions = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

class MultipleChoiceAnswerOptionsSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showPopup: false };
  }

  static propTypes = {
    expression: PropTypes.shape({
      condition: string,
      left: PropTypes.shape({
        options: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string,
          })
        ),
      }).isRequired,
      right: PropTypes.shape({
        options: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
          })
        ),
      }),
    }).isRequired,
    onRightChange: PropTypes.func.isRequired,
    onConditionChange: PropTypes.func.isRequired,
    groupErrorMessage: PropTypes.string,
  };

  get selectedOptionIds() {
    return get(this.props.expression.right, "options", []).map(({ id }) => id);
  }

  handleRadioChange = ({ name: id, value: checked }) => {
    let newSelectedOptions;
    if (checked) {
      newSelectedOptions = [...this.selectedOptionIds, id];
    } else {
      newSelectedOptions = this.selectedOptionIds.filter(
        (selectedId) => selectedId !== id
      );
    }
    this.props.onRightChange({ selectedOptions: newSelectedOptions });
  };

  handleCheckboxUnselect = (id) => {
    const { expression } = this.props;
    const selectedOptions = expression.right.options
      .filter((option) => option.id !== id)
      .map(({ id }) => id);
    this.props.onRightChange({ selectedOptions });
  };

  handleConditionChange = ({ value }) => {
    this.props.onConditionChange(value);
  };

  handlePickerClose = () => {
    this.setState({ showPopup: false });
  };

  handleError = () => {
    const { expression, groupErrorMessage } = this.props;
    let message = groupErrorMessage;

    const error = find(
      expression.validationErrorInfo.errors,
      (error) =>
        error.errorCode.includes("ERR_RIGHTSIDE") ||
        error.errorCode.includes(
          "ERR_GROUP_MIXING_EXPRESSIONS_WITH_OR_STND_OPTIONS_IN_AND"
        ) ||
        error.errorCode.includes("ERR_LOGICAL_AND")
    );

    if (
      expression.validationErrorInfo.errors.some(
        ({ field }) => field === "secondaryCondition"
      )
    ) {
      message = OPERATOR_REQUIRED;
    }
    if (
      expression.validationErrorInfo.errors.some(
        ({ errorCode }) =>
          errorCode === "ERR_COUNT_OF_GREATER_THAN_AVAILABLE_OPTIONS"
      )
    ) {
      message = ERR_COUNT_OF_GREATER_THAN_AVAILABLE_OPTIONS;
    } else if (error) {
      if (expression.condition === "CountOf") {
        message = rightSideErrors[error.errorCode].message;
      } else {
        message =
          message ||
          rightSideErrors[error.errorCode].optionsMessage ||
          rightSideErrors[error.errorCode].message;
      }
    }

    return message ? <ValidationError>{message}</ValidationError> : null;
  };

  renderRadioOptionSelector(hasError) {
    const { expression } = this.props;
    const options = get(expression, "left.options", []);

    return (
      <>
        <MultipleChoiceAnswerOptions
          data-test="options-selector"
          hasError={hasError}
        >
          <Label>Match</Label>
          <ConditionSelect
            onChange={this.handleConditionChange}
            defaultValue={expression.condition}
            data-test="condition-dropdown"
          >
            <option value={answerConditions.ONEOF}>One of</option>
            <option value={answerConditions.UNANSWERED}>Unanswered</option>
          </ConditionSelect>
          {expression.condition !== answerConditions.UNANSWERED &&
            options.map((option) => (
              <ToggleChip
                key={option.id}
                name={option.id}
                title={option.label}
                checked={includes(this.selectedOptionIds, option.id)}
                onChange={this.handleRadioChange}
              >
                {option.label || <strong>Unlabelled option</strong>}
              </ToggleChip>
            ))}
        </MultipleChoiceAnswerOptions>
        {this.handleError()}
      </>
    );
  }

  renderCheckboxOptionSelector(hasError, hasConditionError) {
    const { expression } = this.props;

    return (
      <>
        <MultipleChoiceAnswerOptions
          data-test="options-selector"
          hasError={hasError}
        >
          <Label>Match</Label>
          <ConditionSelect
            onChange={this.handleConditionChange}
            defaultValue={expression.condition}
            hasError={hasConditionError}
            data-test="condition-dropdown"
          >
            <option value={answerConditions.ANYOF}>Any of</option>
            <option value={answerConditions.NOTANYOF}>Not any of</option>
            <option value={answerConditions.ALLOF}>All of</option>
            {enableOn(["enableCountCondition"]) && (
              <option value={answerConditions.COUNTOF}>Count of</option>
            )}
            <option value={answerConditions.UNANSWERED}>Unanswered</option>
          </ConditionSelect>
          {expression.condition === answerConditions.COUNTOF &&
            enableOn(["enableCountCondition"]) && (
              <SecondaryConditionSelector
                expression={expression}
                onRightChange={this.props.onRightChange}
                onConditionChange={this.props.onConditionChange}
              />
            )}
          {expression.condition !== answerConditions.UNANSWERED &&
            expression.condition !== answerConditions.COUNTOF && (
              <>
                <TransitionGroup component={SelectedOptions}>
                  {get(expression, "right.options", []).map((option) => {
                    const isMutuallyExclusive =
                      expression.left.mutuallyExclusiveOption &&
                      option.id === expression.left.mutuallyExclusiveOption.id;

                    return (
                      <CheckboxChipTransition key={option.id}>
                        <CheckboxChip
                          key={option.id}
                          id={option.id}
                          onRemove={this.handleCheckboxUnselect}
                          isMutuallyExclusive={isMutuallyExclusive}
                        >
                          {option.label || <strong>Unlabelled option</strong>}
                        </CheckboxChip>
                      </CheckboxChipTransition>
                    );
                  })}
                </TransitionGroup>
                <ChooseButton
                  onClick={() => {
                    this.setState({
                      showPopup: true,
                    });
                  }}
                >
                  Choose
                </ChooseButton>
              </>
            )}
          {this.state.showPopup && (
            <Popover isOpen onClose={this.handlePickerClose}>
              <CheckboxOptionPicker
                expression={expression}
                onClose={this.handlePickerClose}
                onRightChange={this.props.onRightChange}
              />
            </Popover>
          )}
        </MultipleChoiceAnswerOptions>
        {this.handleError()}
      </>
    );
  }

  render() {
    const { expression, groupErrorMessage } = this.props;
    const answerType = get(expression, "left.type");

    const { errors } = expression.validationErrorInfo;

    const hasError = errors.length || groupErrorMessage;
    const hasConditionError =
      errors.filter(({ field }) => field === "condition").length > 0;

    if (answerType === RADIO) {
      return this.renderRadioOptionSelector(hasError);
    } else {
      return this.renderCheckboxOptionSelector(hasError, hasConditionError);
    }
  }
}

export default MultipleChoiceAnswerOptionsSelector;
