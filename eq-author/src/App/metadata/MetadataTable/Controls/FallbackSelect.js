import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Autocomplete, AutocompleteProps } from "components/Autocomplete";

const FallbackSelect = ({
  options,
  name,
  onChange,
  onUpdate,
  defaultValue,
}) => {
  const handleSelect = useCallback(
    (element) => {
      onChange(
        {
          name,
          value: element?.innerText ?? "",
        },
        onUpdate
      );
    },
    [name, onChange, onUpdate]
  );

  return (
    <Autocomplete
      options={options}
      placeholder="None"
      borderless
      updateOption={handleSelect}
      defaultValue={defaultValue}
    />
  );
};

FallbackSelect.propTypes = {
  options: AutocompleteProps.options,
  placeholder: AutocompleteProps.placeholder,
  defaultValue: AutocompleteProps.defaultValue,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export { FallbackSelect };
