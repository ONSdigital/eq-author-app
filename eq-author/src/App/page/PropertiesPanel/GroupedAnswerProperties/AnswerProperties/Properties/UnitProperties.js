import React from "react";
import PropTypes from "prop-types";

import * as unitTypes from "constants/unit-types";

import { Select } from "components/Forms";
import { map, groupBy } from "lodash";

const UnitProperties = ({ unit, ...otherProps }) => {
  const sortedUnits = groupBy(unitTypes.unitConversion, "type");
  return (
    <Select value={unit} {...otherProps} data-test="unit-select">
      {!unit && <option value={``}>{"Select a type"}</option>}
      {map(sortedUnits, (unit, unitType) => (
        <optgroup label={unitType} key={unitType}>
          {map(unit, (unitConfig) => {
            const optionLabel = `(${unitConfig.abbreviation}) ${unitConfig.unit}`;
            return (
              <option value={`${unitConfig.unit}`} key={unitConfig.unit}>
                {optionLabel}
              </option>
            );
          })}
        </optgroup>
      ))}
    </Select>
  );
};

UnitProperties.propTypes = {
  unit: PropTypes.string.isRequired,
};

export default UnitProperties;
