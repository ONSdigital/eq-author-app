import React from "react";
import PropTypes from "prop-types";
import { flowRight, find } from "lodash";

import { Grid, Column } from "components/Grid";
import { ValidationPills } from "../ValidationPills";
import ValidationTitle from "../ValidationTitle";
import AlignedColumn from "../AlignedColumn";
import Duration from "../Duration";
import { ERR_NO_VALUE } from "constants/validationMessages";
import withChangeUpdate from "enhancers/withChangeUpdate";
import * as entityTypes from "constants/validation-entity-types";
import { DATE } from "constants/answer-types";
import { DAYS, MONTHS, YEARS } from "constants/durations";
import PathEnd from "../path-end.svg?inline";

import {
  StyledError,
  RelativePositionText,
  ConnectedPath,
  Now,
} from "./components";
import PreviousAnswerEditor from "../PreviousAnswerEditor";
import MetadataEditor from "./MetadataEditor";
import CustomEditor from "./CustomEditor";
import PositionPicker from "./PositionPicker.js";

const START_COL_SIZE = 3;
const END_COL_SIZE = 12 - START_COL_SIZE;

const getUnits = format => {
  switch (format) {
    case "dd/mm/yyyy":
      return [DAYS, MONTHS, YEARS];
    case "mm/yyyy":
      return [MONTHS, YEARS];
    default:
      return [YEARS];
  }
};

const UnwrappedDateValidation = ({
  validation,
  answer,
  displayName,
  onChange,
  onUpdate,
  onChangeUpdate,
  readKey,
}) => {
  const availableUnits = getUnits(
    answer.properties.format ? answer.properties.format : "dd/mm/yyyy"
  );

  const hasDurationError = find(validation.validationErrorInfo.errors, error =>
    error.errorCode.includes("ERR_OFFSET_NO_VALUE")
  );

  return (
    <div>
      <Grid>
        <AlignedColumn cols={START_COL_SIZE}>
          <ValidationTitle>{displayName} is</ValidationTitle>
        </AlignedColumn>
        <Column cols={END_COL_SIZE}>
          <Duration
            name="offset"
            duration={validation.offset}
            value={validation.offset.unit}
            units={availableUnits}
            onChange={onChange}
            onUpdate={onUpdate}
            hasError={hasDurationError}
          />
        </Column>
      </Grid>
      <Grid>
        <Column cols={START_COL_SIZE}>
          <ConnectedPath />
        </Column>
        <Column cols={END_COL_SIZE}>
          {hasDurationError && <StyledError>{ERR_NO_VALUE}</StyledError>}
        </Column>
      </Grid>
      <Grid>
        <AlignedColumn cols={START_COL_SIZE}>
          {answer.type === DATE ? (
            <PositionPicker
              value={validation.relativePosition}
              onChange={onChange}
              onUpdate={onUpdate}
            />
          ) : (
            <RelativePositionText>
              {validation.relativePosition.toLowerCase()}
            </RelativePositionText>
          )}
          <PathEnd />
        </AlignedColumn>
        <Column cols={9}>
          <ValidationPills
            entityType={validation.entityType}
            onEntityTypeChange={onChangeUpdate}
            Metadata={MetadataEditor}
            answer={answer}
            validation={validation}
            readKey={readKey}
            onChange={onChange}
            onUpdate={onUpdate}
            onChangeUpdate={onChangeUpdate}
            Custom={CustomEditor}
            {...(answer.type === DATE
              ? {
                  PreviousAnswer: PreviousAnswerEditor,
                  Now: Now,
                }
              : {})}
          />
        </Column>
      </Grid>
    </div>
  );
};

UnwrappedDateValidation.propTypes = {
  validation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    customDate: PropTypes.string,
    previousAnswer: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
    }),
    metadata: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
    }),
    offset: PropTypes.shape({
      unit: PropTypes.string.isRequired,
      value: PropTypes.number,
    }).isRequired,
    relativePosition: PropTypes.string.isRequired,
    entityType: PropTypes.oneOf(Object.values(entityTypes)).isRequired,
  }).isRequired,
  answer: PropTypes.shape({
    id: PropTypes.string.required,
    properties: PropTypes.shape({
      format: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onToggleValidationRule: PropTypes.func.isRequired,
  onChangeUpdate: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  displayName: PropTypes.string.isRequired,
  readKey: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
};

export default flowRight(withChangeUpdate)(UnwrappedDateValidation);
export { UnwrappedDateValidation };
