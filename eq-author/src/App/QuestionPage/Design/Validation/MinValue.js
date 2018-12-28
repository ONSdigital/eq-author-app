import React from "react";
import PropTypes from "prop-types";

import { withApollo } from "react-apollo";
import { propType } from "graphql-anywhere";

import { flowRight, inRange, isNaN } from "lodash";

import { Grid, Column } from "components/Grid";
import DisabledMessage from "App/QuestionPage/Design/Validation/DisabledMessage";

import ValidationTitle from "App/QuestionPage/Design/Validation/ValidationTitle";
import ValidationInput from "App/QuestionPage/Design/Validation/ValidationInput";
import ValidationView from "App/QuestionPage/Design/Validation/ValidationView";
import FieldWithInclude from "App/QuestionPage/Design/Validation/FieldWithInclude";
import ValidationContext from "App/QuestionPage/Design/Validation/ValidationContext";

import withUpdateAnswerValidation from "App/QuestionPage/Design/Validation/withUpdateAnswerValidation";
import withToggleAnswerValidation from "App/QuestionPage/Design/Validation/withToggleAnswerValidation";

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

  const handleMinValueChange = ({ value }) => {
    // clamp value of input to +/- limit
    if (value !== "" && !inRange(parseInt(value, 10), 0 - limit, limit + 1)) {
      return false;
    }

    const intValue = parseInt(value, 10);

    const updateValidationRuleInput = {
      id: minValue.id,
      minValueInput: {
        inclusive: minValue.inclusive,
        custom: isNaN(intValue) ? null : intValue
      }
    };

    onUpdateAnswerValidation(updateValidationRuleInput);
  };

  const handleIncludeChange = ({ value }) => {
    const updateValidationRuleInput = {
      id: minValue.id,
      minValueInput: {
        custom: minValue.custom,
        inclusive: value
      }
    };
    onUpdateAnswerValidation(updateValidationRuleInput);
  };

  const renderDisabled = () => <DisabledMessage name="Min value" />;

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
            value={minValue.custom}
            type="number"
            id="min-value"
            onChange={handleMinValueChange}
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
  onUpdateAnswerValidation: PropTypes.func.isRequired,
  onToggleValidationRule: PropTypes.func.isRequired,
  limit: PropTypes.number
};

const withQuestionPageEditing = flowRight(
  withApollo,
  withUpdateAnswerValidation,
  withToggleAnswerValidation
);

export const MinValueWithAnswer = props => (
  <ValidationContext.Consumer>
    {({ answer }) => (
      <MinValue minValue={answer.validation.minValue} {...props} />
    )}
  </ValidationContext.Consumer>
);

export default withQuestionPageEditing(MinValueWithAnswer);
