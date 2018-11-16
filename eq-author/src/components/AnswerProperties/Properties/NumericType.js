import React from "react";

import { Select } from "components/Forms";
import { units } from "constants/answer-types";
import { map, get } from "lodash";

/*  eslint-disable react/no-danger */

const NumericType = ({ type, ...otherProps }) => {
  const value = get(type, "key");

  return (
    <Select value={value} {...otherProps}>
      {map(units, (unit, unitKey) => (
        <optgroup label={unitKey} key={unitKey}>
          {map(unit.types, (unitType, key) => {
            const optionLabel = unitType.char
              ? `(${unitType.char}) ${unitType.label}`
              : unitType.label;

            return (
              <option
                value={`${unitKey}-${key}`}
                key={key}
                dangerouslySetInnerHTML={{
                  __html: optionLabel
                }}
              />
            );
          })}
        </optgroup>
      ))}
    </Select>
  );
};

export default NumericType;
