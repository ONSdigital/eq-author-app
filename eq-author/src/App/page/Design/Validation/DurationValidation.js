import React from "react";
import PropTypes from "prop-types";

import { Grid, Column } from "components/Grid";

import Duration from "./Duration";
import EmphasisedText from "./EmphasisedText";
import AlignedColumn from "./AlignedColumn";

import { DAYS, MONTHS, YEARS } from "constants/durations";

const UNITS = [DAYS, MONTHS, YEARS];

const DurationValidation = ({
  validation: { duration },
  displayName,
  onChange,
  onUpdate,
}) => (
    <div>
      <Grid>
        <AlignedColumn cols={3}>
          <EmphasisedText>{displayName} is</EmphasisedText>
        </AlignedColumn>
        <Column cols={9}>
          <Duration
            name="duration"
            duration={duration}
            units={UNITS}
            onChange={onChange}
            onUpdate={onUpdate}
          />
        </Column>
      </Grid>
    </div>
  );

DurationValidation.propTypes = {
  displayName: PropTypes.string,
  validation: PropTypes.shape({
    id: PropTypes.string,
    enabled: PropTypes.bool,
    duration: PropTypes.shape({
      unit: PropTypes.string,
      value: PropTypes.number,
    }),
  }),
  answer: PropTypes.shape({
    id: PropTypes.string.required,
    properties: PropTypes.shape({
      format: PropTypes.string,
    }),
  }),
  onToggleValidationRule: PropTypes.func,
  onChange: PropTypes.func,
  onUpdate: PropTypes.func,
  testId: PropTypes.string,
};

export default DurationValidation;
