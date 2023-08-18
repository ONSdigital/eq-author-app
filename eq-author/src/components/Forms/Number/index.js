import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { clamp, isNaN } from "lodash";

import Input from "components/Forms/Input";
import { NUMBER, PERCENTAGE, CURRENCY, UNIT } from "constants/answer-types";
import { unitConversion } from "constants/unit-types";
import { radius } from "constants/theme";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  align-items: center;
  width: 8em;
`;

export const NumberInput = styled(Input)`
  width: 100%;
  border-radius: ${radius};
  outline: none;

  &[type="number"]::-webkit-inner-spin-button,
  &[type="number"]::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
  }

  &[type="number"] {
    appearance: textfield;
  }

  ${(props) => props.valueType === CURRENCY && "padding-left: 1.4em"}
  ${(props) => props.valueType === PERCENTAGE && "padding-right: 1.6em"}
`;

const UnitSymbol = styled.div`
  position: absolute;
  opacity: 0.5;
  ${(props) => (props.trailing ? "right: 0.5em" : "left: 0.5em")}
`;

const Number = (props) => {
  const {
    id,
    onChange,
    onBlur,
    value,
    className,
    type,
    unit,
    name,
    min,
    max,
    step,
    ...otherProps
  } = props;
  const unitId = `unit-${id}`;

  const blockChar = (e) => ["E", "e"].includes(e.key) && e.preventDefault();

  const handleChange = ({ value }) => {
    if (value.length === 0) {
      onChange({ name, value: null });
      return;
    }

    const enteredValue =
      min || max ? clamp(parseInt(value, 10), min, max) : parseInt(value, 10);
    const newValue =
      isNaN(enteredValue) || Object.is(enteredValue, -0)
        ? props.default
        : enteredValue;
    onChange({ name: name || id, value: newValue });
  };

  const handleBlur = () => {
    if (value === null) {
      onChange({ name, value: props.default });
    }
    if (onBlur) {
      setTimeout(onBlur);
    }
  };

  return (
    <StyledDiv className={className}>
      <NumberInput
        id={id}
        data-test={props["data-test"]}
        value={value}
        onChange={handleChange}
        type="number"
        onBlur={handleBlur}
        aria-live="assertive"
        valueType={type}
        aria-labelledby={id}
        min={min}
        max={max}
        default={props.default}
        name={name}
        step={step}
        onKeyDown={blockChar}
        {...otherProps}
      />
      {type === CURRENCY && (
        <UnitSymbol id={unitId} data-test="unit">
          £
        </UnitSymbol>
      )}
      {type === PERCENTAGE && (
        <UnitSymbol id={unitId} data-test="unit" trailing>
          %
        </UnitSymbol>
      )}
      {type === UNIT && (
        <UnitSymbol id={unitId} data-test="unit" trailing>
          {unit && unitConversion[unit].abbreviation}
        </UnitSymbol>
      )}
    </StyledDiv>
  );
};

Number.defaultProps = {
  min: 0,
  step: 1,
  default: null,
  "data-test": "number-input",
};

Number.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  value: PropTypes.number,
  step: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number.isRequired,
  default: PropTypes.number,
  type: PropTypes.oneOf([CURRENCY, PERCENTAGE, NUMBER, UNIT]),
  "data-test": PropTypes.string,
  className: PropTypes.string,
  unit: PropTypes.string,
};

export default Number;
