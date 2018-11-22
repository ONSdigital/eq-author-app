import React from "react";

import { Select } from "components/Forms";
import { duration } from "constants/answer-types";
import { map, get } from "lodash";

/*  eslint-disable react/no-danger */

const DurationType = ({ type, hasNone, ...otherProps }) => {
  const value = get(type, "key");

  return (
    <Select value={value} {...otherProps}>
      {hasNone && (
        <option value="none" selected>
          —
        </option>
      )}
      {map(duration, (unit, unitKey) => (
        <option
          value={`${unitKey}`}
          key={unitKey}
          dangerouslySetInnerHTML={{
            __html: unit.label
          }}
          disabled={unit.disabled}
        />
      ))}
    </Select>
  );
};

DurationType.defaultProps = {
  hasNone: false
};

export default DurationType;
