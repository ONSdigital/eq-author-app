import React from "react";
import PropTypes from "prop-types";

import * as entityTypes from "constants/validation-entity-types";

const formatDate = (dateString) => dateString.split("-").reverse().join("/");

const DatePreview = ({
  relativePosition,
  offset: { unit, value },
  entityType,
  customDate,
  previousAnswer,
  metadata,
}) => {
  const isCustom = entityType === entityTypes.CUSTOM;
  const isPreviousAnswer = entityType === entityTypes.PREVIOUS_ANSWER;
  const isMetadata = entityType === entityTypes.METADATA;

  const isInvalidRule =
    (isCustom && !customDate) ||
    (isPreviousAnswer && !previousAnswer) ||
    (isMetadata && !metadata);

  if (isInvalidRule) {
    return;
  }

  const rule = {
    [entityTypes.CUSTOM]: customDate ? formatDate(customDate) : "",
    [entityTypes.PREVIOUS_ANSWER]: previousAnswer
      ? previousAnswer.displayName
      : "",
    [entityTypes.METADATA]: metadata ? metadata.displayName : "",
    [entityTypes.NOW]: "(Start date)",
  };

  if (value === 0) {
    return rule[entityType];
  }

  if (!value) {
    return;
  }

  return (
    <React.Fragment>
      <div>
        {`${value} ${unit.toLowerCase()} ${relativePosition.toLowerCase()}:`}
      </div>
      <div>{rule[entityType]}</div>
    </React.Fragment>
  );
};

DatePreview.propTypes = {
  relativePosition: PropTypes.string.isRequired,
  customDate: PropTypes.string,
  offset: PropTypes.shape({
    value: PropTypes.number.isRequired,
    unit: PropTypes.string.isRequired,
  }).isRequired,
  entityType: PropTypes.oneOf(Object.values(entityTypes)).isRequired,
  previousAnswer: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
  }),
  metadata: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
  }),
};

export default DatePreview;
