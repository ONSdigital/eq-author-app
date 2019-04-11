import React from "react";
import styled from "styled-components";

import ToggleChip from "components/buttons/ToggleChip";
import { includes, get } from "lodash";

import { PropTypes } from "prop-types";

const MultipleChoiceAnswerOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 1em 0;
`;

class MultipleChoiceAnswerOptionsSelector extends React.Component {
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
  };

  get selectedOptionIds() {
    return get(this.props.expression.right, "options", []).map(({ id }) => id);
  }

  handleChange = ({ name: id, value: checked }) => {
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

  render() {
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
            onChange={this.handleChange}
          >
            {option.label || <strong>Unlabelled option</strong>}
          </ToggleChip>
        ))}
      </MultipleChoiceAnswerOptions>
    );
  }
}

export default MultipleChoiceAnswerOptionsSelector;
