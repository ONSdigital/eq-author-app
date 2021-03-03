import React from "react";
import PropTypes from "prop-types";
import { find } from "lodash";
import styled from "styled-components";

import { Grid, Column } from "components/Grid";

import Duration from "./Duration";
import EmphasisedText from "./EmphasisedText";
import AlignedColumn from "./AlignedColumn";
import ValidationError from "components/ValidationError";
import { DAYS, MONTHS, YEARS } from "constants/durations";
import { ERR_NO_VALUE } from "constants/validationMessages";

const UNITS = [DAYS, MONTHS, YEARS];

const StyledError = styled(ValidationError)`
  justify-content: start;
  width: 60%;
`;

const DurationValidation = (props) => {
  const {
    validation: { duration },
    displayName,
    onChange,
    onUpdate,
    validation,
  } = props;

  const hasError = find(
    validation.validationErrorInfo.errors,
    ({ errorCode }) => errorCode.includes("ERR_NO_VALUE")
  );

  const handleError = () => {
    return <StyledError>{ERR_NO_VALUE}</StyledError>;
  };

  return (
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
            hasError={hasError}
          />
        </Column>
      </Grid>
      <Grid>
        <Column cols={3}>{null}</Column>
        <Column cols={9}>{hasError && handleError()}</Column>
      </Grid>
    </div>
  );
};

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
