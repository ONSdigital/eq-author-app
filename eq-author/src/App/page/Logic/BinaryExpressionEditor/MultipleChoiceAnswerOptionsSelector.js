import React from "react";
import styled from "styled-components";
import { includes, get, some, find } from "lodash";
import { PropTypes } from "prop-types";
import { TransitionGroup } from "react-transition-group";

import CheckboxChip from "./CheckboxChip";
import CheckboxChipTransition from "./CheckboxChipTransition";
import CheckboxOptionPicker from "./CheckboxOptionPicker";
import Popover from "./CheckboxSelectorPopup";
import ValidationError from "components/ValidationError";

import { rightSideErrors } from "constants/validationMessages";
import { colors } from "constants/theme";
import { RADIO } from "constants/answer-types";
import { Select } from "components/Forms";

import TextButton from "components/buttons/TextButton";
import ToggleChip from "components/buttons/ToggleChip";

const answerConditions = {
  UNANSWERED: "Unanswered",
  ALLOF: "AllOf",
  ANYOF: "AnyOf",
  ONEOF: "OneOf",
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
    border-color: ${colors.red};
    outline-color: ${colors.red};
    box-shadow: 0 0 0 2px ${colors.red};
    border-radius: 4px;
    margin-bottom: 0;
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
        selectedId => selectedId !== id
      );
    }
    this.props.onRightChange({ selectedOptions: newSelectedOptions });
  };

  handleCheckboxUnselect = id => {
    const { expression } = this.props;
    const selectedOptions = expression.right.options
      .filter(option => option.id !== id)
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
    const { expression } = this.props;

    const { errorCode } = find(expression.validationErrorInfo.errors, error =>
      error.errorCode.includes("ERR_RIGHTSIDE")
    );

    return (
      <ValidationError right>
        {rightSideErrors[errorCode].optionsMessage ||
          rightSideErrors[errorCode].message}
      </ValidationError>
    );
  };

  renderRadioOptionSelector(hasError) {
    const { expression } = this.props;
    const options = get(expression, "left.options", []);
    console.log(options, "what is this?");
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
            options.map(option => (
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
        {hasError && this.handleError()}
      </>
    );
  }

  renderCheckboxOptionSelector(hasError) {
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
            data-test="condition-dropdown"
          >
            <option value={answerConditions.ANYOF}>Any of</option>
            <option value={answerConditions.ALLOF}>All of</option>
            <option value={answerConditions.UNANSWERED}>Unanswered</option>
          </ConditionSelect>
          {expression.condition !== answerConditions.UNANSWERED && (
            <>
              <TransitionGroup component={SelectedOptions}>
                {get(expression, "right.options", []).map(option => {
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
        {hasError && this.handleError()}
      </>
    );
  }

  render() {
    const { expression } = this.props;
    const answerType = get(expression, "left.type");

    const hasError = some(expression.validationErrorInfo.errors, error =>
      error.errorCode.includes("ERR_RIGHTSIDE")
    );

    if (answerType === RADIO) {
      return this.renderRadioOptionSelector(hasError);
    } else {
      return this.renderCheckboxOptionSelector(hasError);
    }
  }
}

export default MultipleChoiceAnswerOptionsSelector;
