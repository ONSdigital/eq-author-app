import React from "react";
import styled from "styled-components";
import { includes, get } from "lodash";
import { PropTypes } from "prop-types";
import { TransitionGroup } from "react-transition-group";

import CheckboxChipTransition from "./CheckboxChipTransition";
import { colors } from "constants/theme";
import { RADIO } from "constants/answer-types";
import { Select } from "components/Forms";

import TextButton from "components/buttons/TextButton";
import ToggleChip from "components/buttons/ToggleChip";
import Popover from "./CheckboxSelectorPopup";
import CheckboxOptionPicker from "./CheckboxOptionPicker";
import CheckboxChip from "./CheckboxChip";

const answerConditions = {
  UNANSWERED: "Unanswered",
  ALLOF: "AllOf",
  ANYOF: "AnyOf",
};

const MultipleChoiceAnswerOptions = styled.div`
  align-items: center;
  padding: 1em 0;
  display: inline-flex;
  flex-flow: row wrap;
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
  margin: 0.25rem;
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

  renderRadioOptionSelector() {
    const { expression } = this.props;
    const options = get(expression, "left.options", []);

    return (
      <MultipleChoiceAnswerOptions data-test="options-selector">
        {options.map(option => (
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
    );
  }

  renderCheckboxOptionSelector() {
    const { expression } = this.props;
    return (
      <MultipleChoiceAnswerOptions data-test="options-selector">
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
              {get(expression, "right.options", []).map(option => (
                <CheckboxChipTransition key={option.id}>
                  <CheckboxChip
                    key={option.id}
                    id={option.id}
                    onRemove={this.handleCheckboxUnselect}
                  >
                    {option.label}
                  </CheckboxChip>
                </CheckboxChipTransition>
              ))}
            </TransitionGroup>
            <ChooseButton
              onClick={() => {
                this.setState({
                  showPopup: true,
                });
              }}
            >
              CHOOSE
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
    );
  }

  render() {
    const { expression } = this.props;
    const answerType = get(expression, "left.type");
    if (answerType === RADIO) {
      return this.renderRadioOptionSelector();
    } else {
      return this.renderCheckboxOptionSelector();
    }
  }
}

export default MultipleChoiceAnswerOptionsSelector;
