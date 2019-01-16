import React from "react";
import PropTypes from "prop-types";

import { Number, Select } from "components/Forms";
import { Grid, Column } from "components/Grid";

import { DAYS, MONTHS, YEARS } from "constants/durations";

const UNITS = [DAYS, MONTHS, YEARS];

const Duration = ({
  name,
  units,
  duration: { value, unit },
  onChange,
  onUpdate,
}) => (
  <Grid>
    <Column cols={2}>
      <Number
        id={`${name}-value`}
        name={`${name}.value`}
        value={value}
        onChange={onChange}
        onBlur={onUpdate}
        max={99999}
        min={0}
      />
    </Column>
    <Column cols={4}>
      <Select
        id={`${name}-unit`}
        name={`${name}.unit`}
        value={unit}
        onChange={onChange}
        onBlur={onUpdate}
      >
        {units.map(unit => (
          <option key={unit} value={unit}>
            {unit}
          </option>
        ))}
      </Select>
    </Column>
  </Grid>
);

Duration.propTypes = {
  name: PropTypes.string.isRequired,
  duration: PropTypes.shape({
    value: PropTypes.number.isRequired,
    unit: PropTypes.oneOf(UNITS).isRequired,
  }).isRequired,
  units: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default Duration;
