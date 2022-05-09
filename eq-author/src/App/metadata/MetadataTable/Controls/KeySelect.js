import PropTypes from "prop-types";
import React, { Component } from "react";
import { reject, includes } from "lodash";

import Typeahead from "components/Forms/Typeahead";
import {
  TableTypeaheadInput,
  TableTypeaheadMenu,
} from "components/datatable/Controls";

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
  { value: "employment_date" },
  { value: "region_code" },
  { value: "display_address" },
  { value: "country" },
];

export const removeUsedKeys = (usedKeys) =>
  reject(suggestedKeys, ({ value }) => includes(usedKeys, value));

class KeySelect extends Component {
  state = {
    value: this.props.defaultValue || "",
  };

  handleBlur = () => {
    const { name, onChange, onUpdate } = this.props;
    const { value } = this.state;
    onChange({ name, value }, onUpdate);
  };

  handleStateChange = (changes) => {
    const { name, onChange, onUpdate } = this.props;
    const { inputValue: value, selectedItem } = changes;
    if (selectedItem) {
      onChange({ name, value: selectedItem.value }, onUpdate);
    }
    if (/^[a-z0-9-_]+$/i.test(value) || value === "") {
      if (value === undefined) {
        this.setState(() => ({ selectedItem }));
      } else {
        this.setState(() => ({ value }));
      }
    }
  };

  render() {
    const { name, usedKeys } = this.props;
    const { value } = this.state;

    return (
      <Typeahead
        onStateChange={this.handleStateChange}
        selectedItem={{ value }}
      >
        {({ getInputProps, isOpen, openMenu, ...otherProps }) => (
          <div>
            <TableTypeaheadInput
              name={name}
              {...getInputProps({
                onFocus: openMenu,
                onBlur: this.handleBlur,
                "data-test": "key-input",
              })}
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
  usedKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default KeySelect;
