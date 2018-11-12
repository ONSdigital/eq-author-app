import React from "react";
import PropTypes from "prop-types";
import { isNil } from "lodash";
import Select from "components/Forms/Select";

export const textSelect = "Please select…";

const GroupedSelect = ({ groups, onChange, value, valid, ...otherProps }) => {
  const optGroups = groups.map(group => (
    <optgroup label={group.label} key={group.id}>
      {group.options.map(option => (
        <option
          value={option.value}
          key={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </optgroup>
  ));

  return (
    <Select
      onChange={onChange}
      value={isNil(value) ? "" : value}
      invalid={!valid}
      {...otherProps}
    >
      {isNil(value) && (
        <option disabled value="" key="please-select">
          {textSelect}
        </option>
      )}
      {optGroups}
    </Select>
  );
};

const OptionProp = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
});

const GroupProp = PropTypes.shape({
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(OptionProp).isRequired
});

GroupedSelect.propTypes = {
  groups: PropTypes.arrayOf(GroupProp).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  valid: PropTypes.bool
};

GroupedSelect.defaultProps = {
  valid: true
};

export default GroupedSelect;
