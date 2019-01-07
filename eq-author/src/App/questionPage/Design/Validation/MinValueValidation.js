import React from "react";
import PropTypes from "prop-types";
import { flowRight } from "lodash";

import { Grid, Column } from "components/Grid";

import FieldWithInclude from "./FieldWithInclude";
import ValidationTitle from "./ValidationTitle";
import ValidationInput from "./ValidationInput";
import withCustomNumberValueChange from "./withCustomNumberValueChange";
import withChangeUpdate from "enhancers/withChangeUpdate";

export const UnwrappedMinValueValidation = ({
  validation: { inclusive, custom },
  displayName,
  onUpdate,
  limit,
  onChangeUpdate,
  onCustomNumberValueChange
}) => (
  <Grid>
    <Column cols={3}>
      <ValidationTitle>{displayName} is</ValidationTitle>
    </Column>
    <Column cols={9}>
      <FieldWithInclude
        id="inclusive"
        name="inclusive"
        onChange={onChangeUpdate}
        checked={inclusive}
      >
        <ValidationInput
          data-test="min-value-input"
          value={custom}
          type="number"
          onChange={onCustomNumberValueChange}
          onBlur={onUpdate}
          max={limit}
          min={0 - limit}
        />
      </FieldWithInclude>
    </Column>
  </Grid>
);

UnwrappedMinValueValidation.propTypes = {
  limit: PropTypes.number,
  validation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    custom: PropTypes.number,
    inclusive: PropTypes.bool.isRequired
  }).isRequired,
  answer: PropTypes.shape({
    id: PropTypes.string.required,
    properties: PropTypes.shape({
      format: PropTypes.string
    }).isRequired
  }).isRequired,
  onCustomNumberValueChange: PropTypes.func.isRequired,
  onChangeUpdate: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  displayName: PropTypes.string.isRequired,
  readKey: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired
};

export default flowRight(
  withCustomNumberValueChange,
  withChangeUpdate
)(UnwrappedMinValueValidation);
