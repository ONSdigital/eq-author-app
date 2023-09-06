import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme.js";

import SelectIcon from "assets/icon-select.svg";

const StyledSelect = styled.select`
  font-size: 1em;
  border: 2px solid ${colors.lightGrey};
  border-radius: 4px;
  appearance: none;
  background: white url(${SelectIcon}) no-repeat right center;
  position: relative;
  transition: opacity 100ms ease-in-out;
  border-radius: 4px;
  padding: 0.3em 1.5em 0.3em 0.3em;
  color: ${colors.text};
  display: block;
  min-width: 30%;
  border-color: ${({ hasError }) => hasError && colors.errorPrimary};

  &:hover {
    outline: none;
  }
`;

const Option = styled.option``;

const Select = ({
  name,
  dataTest,
  value,
  defaultValue,
  ariaLabel,
  options,
  additionalOption,
  handleChange,
  hasError,
}) => {
  return (
    <StyledSelect
      name={name}
      data-test={dataTest}
      value={value}
      onChange={handleChange}
      aria-label={ariaLabel}
      hasError={hasError}
    >
      {defaultValue && <Option value="">{defaultValue}</Option>}
      {options.map((option) => (
        <Option key={option.id} value={option.id}>
          {option.displayName}
        </Option>
      ))}
      {additionalOption && (
        <Option value={additionalOption.value}>
          {additionalOption.displayName}
        </Option>
      )}
    </StyledSelect>
  );
};

Select.propTypes = {
  /**
   * The name of the select component.
   */
  name: PropTypes.string,
  /**
   * data-test value used for component tests.
   */
  dataTest: PropTypes.string,
  /**
   * The currently selected option value (must match option.id).
   */
  value: PropTypes.string.isRequired,
  /**
   * Text displayed for optional empty default option.
   */
  defaultValue: PropTypes.string,
  /**
   * Label value read by screen readers.
   */
  ariaLabel: PropTypes.string,
  /**
   * Array of option objects available in the select menu.
   */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
    })
  ),
  /**
   * Object for optional empty additional option.
   */
  additionalOption: PropTypes.shape({
    value: PropTypes.string,
    displayName: PropTypes.string,
  }),
  /**
   * Function run onChange.
   */
  handleChange: PropTypes.func.isRequired,
  /**
   * Value for if component has a validation error and should use error styling.
   */
  hasError: PropTypes.bool,
};

export default Select;
