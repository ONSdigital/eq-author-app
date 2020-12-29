import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Autocomplete, AutocompleteProps } from "components/Autocomplete";

const FallbackSelect = ({ options, name, onChange, onUpdate }) => {
  const handleSelect = useCallback(
    element =>
      onChange(
        {
          name,
          value: element?.children?.[0]?.getAttribute("value") ?? "",
        },
        onUpdate
      ),
    [name, onChange, onUpdate]
  );

  return (
    <Autocomplete
      options={options}
      placeholder="None"
      borderless
      updateOption={handleSelect}
    />
  );
};

FallbackSelect.propTypes = {
  options: AutocompleteProps.options,
  placeholder: AutocompleteProps.placeholder,
  updateOption: AutocompleteProps.updateOption,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export { FallbackSelect };
