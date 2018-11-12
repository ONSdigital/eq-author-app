import PropTypes from "prop-types";
import React, { Component } from "react";
import Downshift from "downshift";
import { reject, includes, isUndefined } from "lodash";

import Typeahead from "components/Typeahead";
import {
  TableTypeaheadInput,
  TableTypeaheadMenu
} from "components/DataTable/Controls";

export const suggestedKeys = [
  { value: "ru_ref" },
  { value: "ru_name" },
  { value: "trad_as" },
  { value: "period_id" },
  { value: "period_str" },
  { value: "language_code" },
  { value: "ref_p_start_date" },
  { value: "ref_p_end_date" },
  { value: "return_by" },
  { value: "employmentDate" },
  { value: "region_code" },
  { value: "display_address" },
  { value: "country" }
];

export const removeUsedKeys = usedKeys =>
  reject(suggestedKeys, ({ value }) => includes(usedKeys, value));

class KeySelect extends Component {
  state = {
    value: this.props.defaultValue || ""
  };

  getChangeValue = changes => {
    if (changes.hasOwnProperty("selectedItem")) {
      return changes.selectedItem.value;
    } else if (changes.hasOwnProperty("inputValue")) {
      return changes.inputValue;
    }
  };

  stateReducer = (state, changes) => {
    const { name, onChange, onUpdate } = this.props;

    if (
      changes.type === Downshift.stateChangeTypes.blurInput ||
      changes.type === Downshift.stateChangeTypes.mouseUp
    ) {
      onUpdate();
    } else if (
      changes.type === Downshift.stateChangeTypes.clickItem ||
      changes.type === Downshift.stateChangeTypes.keyDownEnter
    ) {
      let value = this.getChangeValue(changes);
      onChange({ name, value }, () => onUpdate());
    }

    return changes;
  };

  handleStateChange = changes => {
    const { name, onChange } = this.props;
    let value = this.getChangeValue(changes);

    if (isUndefined(value)) {
      return;
    }

    this.setState(() => {
      onChange({ name, value });
      return { value };
    });
  };

  render() {
    const { name, usedKeys } = this.props;
    const { value } = this.state;

    return (
      <Typeahead
        stateReducer={this.stateReducer}
        onStateChange={this.handleStateChange}
        selectedItem={{ value }}
        inputValue={value}
      >
        {({ getInputProps, isOpen, openMenu, ...otherProps }) => (
          <div>
            <TableTypeaheadInput
              name={name}
              {...getInputProps({ onFocus: openMenu })}
            />
            {isOpen && (
              <TableTypeaheadMenu
                items={removeUsedKeys(usedKeys)}
                {...otherProps}
              />
            )}
          </div>
        )}
      </Typeahead>
    );
  }
}

KeySelect.propTypes = {
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  usedKeys: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default KeySelect;
