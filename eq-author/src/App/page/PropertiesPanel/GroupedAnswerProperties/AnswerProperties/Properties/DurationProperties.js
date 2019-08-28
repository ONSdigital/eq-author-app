import React from "react";
import PropTypes from "prop-types";
import { Select } from "components/Forms";
import { map, groupBy } from "lodash";

import * as durationTypes from "constants/duration-types";

const DurationProperties = ({ unit, ...otherProps }) => {
  const sortedUnits = groupBy(durationTypes.durationConversion, "type");
  return (
    <Select value={unit} {...otherProps} data-test="duration-select">
      {map(sortedUnits, (unit, durationType) => {
        return (
          <optgroup label={durationType} key={durationType}>
            {map(unit, (durationConfig, key) => {
              const optionLabel = durationConfig.abbreviation;
              return (
                <option value={`${durationConfig.duration}`} key={key}>
                  {optionLabel}
                </option>
              );
            })}
          </optgroup>
        );
      })}
    </Select>
  );
};

DurationProperties.propTypes = {
  unit: PropTypes.string.isRequired,
};

export default DurationProperties;
