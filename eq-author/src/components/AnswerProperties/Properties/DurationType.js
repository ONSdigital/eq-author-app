import React from "react";

import { Select } from "components/Forms";
import { duration } from "constants/answer-types";
import { map, get } from "lodash";

/*  eslint-disable react/no-danger */

// const DurationType = ({ type, hasNone, ...otherProps }) => {
//   const value = get(type, "key");

//   return (
//     <Select value={value} {...otherProps}>

//       {map(duration, (unit, unitKey) => (
//         <option
//           value={`${unitKey}`}
//           key={unitKey}
//           dangerouslySetInnerHTML={{
//             __html: unit.label
//           }}
//           disabled={unit.disabled}
//         />
//       ))}
//     </Select>
//   );
// };

// export default DurationType;

const DurationType = ({ type, ...otherProps }) => {
  const value = get(type, "key");

  return (
    <Select value={value} {...otherProps}>
      {map(duration, (unit, unitKey) => (
        <optgroup label={unit.name} key={unitKey}>
          {map(unit.types, (unitType, key) => {
            const optionLabel = unitType.label;
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

export default DurationType;
