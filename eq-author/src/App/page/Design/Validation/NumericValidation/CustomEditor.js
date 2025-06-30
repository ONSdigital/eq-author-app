import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { find } from "lodash";

import { colors } from "constants/theme";

import { Number } from "components/Forms";
import FieldWithInclude from "../FieldWithInclude";
import { ERR_NO_VALUE } from "constants/validationMessages";
import ValidationError from "components/ValidationError";
import * as entityTypes from "constants/validation-entity-types";

const StyledNumber = styled(Number)`
  width: 11em;
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

const StyledError = styled(ValidationError)`
  justify-content: start;
  width: 60%;
`;

const CustomEditor = (props) => {
  const {
    onUpdate,
    answer,
    onChangeUpdate,
    validation,
    limit,
    onCustomNumberValueChange,
  } = props;

  const hasError = find(validation.validationErrorInfo.errors, (error) =>
    error.errorCode.includes("ERR_NO_VALUE")
  );

  const handleError = () => {
    return <StyledError>{ERR_NO_VALUE}</StyledError>;
  };
  return (
    <>
      <FieldWithInclude
        id="inclusive"
        name="inclusive"
        onChange={onChangeUpdate}
        checked={validation.inclusive}
      >
        <StyledNumber
          hasError={hasError}
          default={null}
          data-test="numeric-value-input"
          value={validation.custom}
          type={answer.type}
          unit={answer.properties.unit}
          onChange={onCustomNumberValueChange}
          onBlur={onUpdate}
          name="custom"
          max={limit}
          min={0 - limit}
        />
      </FieldWithInclude>
      {hasError && handleError()}
    </>
  );
};

CustomEditor.defaultProps = {
  validation: {
    custom: null,
  },
};

CustomEditor.propTypes = {
  limit: PropTypes.number.isRequired,
  validation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    custom: PropTypes.number,
    inclusive: PropTypes.bool.isRequired,
    previousAnswer: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
    }),
    entityType: PropTypes.oneOf(Object.values(entityTypes)),
  }).isRequired,
  answer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    properties: PropTypes.shape({
      unit: PropTypes.string,
    }),
    validationErrorInfo: PropTypes.shape({
      errors: PropTypes.arrayOf(
        PropTypes.shape({
          errorCode: PropTypes.string,
          field: PropTypes.string,
          id: PropTypes.string,
          type: PropTypes.string,
        })
      ),
    }),
  }).isRequired,
  onCustomNumberValueChange: PropTypes.func.isRequired,
  onChangeUpdate: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default CustomEditor;
