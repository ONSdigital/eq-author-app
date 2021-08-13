import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";

import { Number, Select } from "components/Forms";
import { Grid, Column } from "components/Grid";

import { DAYS, MONTHS, YEARS } from "constants/durations";

export const DurationNumber = styled(Number)`
  width: 100%;

  ${({ hasError }) =>
    hasError &&
    `
    border-color: ${colors.errorPrimary};
    outline-color: ${colors.errorPrimary};
    box-shadow: 0 0 0 2px ${colors.errorPrimary};
    border-radius: 4px;
    margin-bottom: 0;
  `}
`;

const UNITS = [DAYS, MONTHS, YEARS];

const Duration = ({
  name,
  units,
  duration: { value, unit },
  onChange,
  onUpdate,
  hasError,
}) => (
  <Grid>
    <Column cols={2}>
      <DurationNumber
        id={`${name}-value`}
        name={`${name}.value`}
        value={value}
        onChange={onChange}
        onBlur={onUpdate}
        max={99999}
        min={0}
        hasError={hasError}
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
        {units.map((unit) => (
          <option key={unit} value={unit}>
            {unit.toLowerCase()}
          </option>
        ))}
      </Select>
    </Column>
  </Grid>
);

Duration.propTypes = {
  name: PropTypes.string.isRequired,
  duration: PropTypes.shape({
    value: PropTypes.number,
    unit: PropTypes.oneOf(UNITS).isRequired,
  }).isRequired,
  units: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  hasError: PropTypes.object, // eslint-disable-line
};

export default Duration;
