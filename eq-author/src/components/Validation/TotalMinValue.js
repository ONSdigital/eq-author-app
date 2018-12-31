import React from "react";
import PropTypes from "prop-types";

import { withApollo } from "react-apollo";
import { propType } from "graphql-anywhere";

import { flowRight, inRange, isNaN } from "lodash";

import { Grid, Column } from "components/Grid";
import DisabledMessage from "components/Validation/DisabledMessage";

import ValidationTitle from "components/Validation/ValidationTitle";
import ValidationInput from "components/Validation/ValidationInput";
import ValidationView from "components/Validation/ValidationView";
import FieldWithInclude from "components/Validation/FieldWithInclude";
import ValidationContext from "components/Validation/ValidationContext";

import MinValueValidationRule from "graphql/fragments/min-value-validation-rule.graphql";

export const MinValue = ({
  minValue,
  onUpdateAnswerValidation,
  onToggleValidationRule,
  limit
}) => {
  const handleToggleChange = ({ value }) => {
    const toggleValidationRuleInput = {
      id: minValue.id,
      enabled: value
    };

    onToggleValidationRule(toggleValidationRuleInput);
  };

  const handleMinValueChange = ({ target: { value } }) => {
    // clamp value of input to +/- limit
    if (value !== "" && !inRange(parseInt(value, 10), 0 - limit, limit + 1)) {
      return false;
    }

    const intValue = parseInt(value, 10);

    const updateValidationRuleInput = {
      id: minValue.id,
      minValue: {
        inclusive: minValue.inclusive,
        custom: isNaN(intValue) ? null : intValue
      }
    };

    onUpdateAnswerValidation(updateValidationRuleInput);
  };

  const handleIncludeChange = ({ value }) => {
    const updateValidationRuleInput = {
      id: minValue.id,
      minValue: {
        custom: minValue.custom,
        inclusive: value
      }
    };
    onUpdateAnswerValidation(updateValidationRuleInput);
  };

  const renderDisabled = () => (
    <DisabledMessage>Min value is disabled</DisabledMessage>
  );

  const renderContent = () => (
    <Grid>
      <Column cols={3}>
        <ValidationTitle>Min Value is</ValidationTitle>
      </Column>
      <Column>
        <FieldWithInclude
          id="min-value-include"
          name="min-value-include"
          onChange={handleIncludeChange}
          checked={minValue.inclusive}
        >
          <ValidationInput
            data-test="min-value-input"
            list="defaultNumbers"
            defaultValue={minValue.custom}
            type="number"
            id="min-value"
            onBlur={handleMinValueChange}
            max={limit}
            min={0 - limit}
          />
        </FieldWithInclude>
      </Column>
    </Grid>
  );

  return (
    <ValidationView
      onToggleChange={handleToggleChange}
      enabled={minValue.enabled}
      data-test="min-value-view"
    >
      {minValue.enabled ? renderContent() : renderDisabled()}
    </ValidationView>
  );
};

MinValue.defaultProps = {
  limit: 999999999
};

MinValue.propTypes = {
  minValue: propType(MinValueValidationRule).isRequired,
  // onUpdateAnswerValidation: PropTypes.func.isRequired,
  // onToggleValidationRule: PropTypes.func.isRequired,
  limit: PropTypes.number
};

export const MinValueWithAnswer = props => (
  <ValidationContext.Consumer>
    {({ answer, ...rest }) => (
      <MinValue minValue={answer.validation.minValue} {...props} {...rest} />
    )}
  </ValidationContext.Consumer>
);

export default MinValueWithAnswer;
