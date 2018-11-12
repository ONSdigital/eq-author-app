import { ANSWER } from "components/ContentPickerSelect/content-types";
import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";
import { withApollo } from "react-apollo";
import { propType } from "graphql-anywhere";

import { flowRight, get, inRange, isNaN } from "lodash";

import ContentPickerSelect from "components/ContentPickerSelect";
import { Grid, Column } from "components/Grid";
import { Field, Label } from "components/Forms";
import ToggleSwitch from "components/ToggleSwitch";

import DisabledMessage from "components/Validation/DisabledMessage";
import { ValidationPills } from "components/Validation/ValidationPills";
import ValidationTitle from "components/Validation/ValidationTitle";
import ValidationView from "components/Validation/ValidationView";
import ValidationContext from "components/Validation/ValidationContext";
import ValidationInput from "components/Validation/ValidationInput";
import PathEnd from "components/Validation/path-end.svg?inline";

import withUpdateAnswerValidation from "containers/enhancers/withUpdateAnswerValidation";
import withToggleAnswerValidation from "containers/enhancers/withToggleAnswerValidation";

import MaxValueValidationRule from "graphql/fragments/max-value-validation-rule.graphql";

import * as answerTypes from "constants/answer-types";

const InlineField = styled(Field)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: -0.8em;
`;

const Connector = styled(PathEnd)`
  margin-top: 0.75em;
`;

export class MaxValue extends React.Component {
  PreviousAnswer = () => (
    <ContentPickerSelect
      name="previousAnswer"
      onSubmit={this.handlePreviousAnswerChange}
      answerTypes={[this.props.answerType]}
      contentTypes={[ANSWER]}
      selectedContentDisplayName={get(
        this.props.maxValue.previousAnswer,
        "displayName"
      )}
    />
  );

  Custom = () => (
    <ValidationInput
      data-test="max-value-input"
      list="defaultNumbers"
      value={this.props.maxValue.custom}
      type="number"
      onChange={this.handleCustomValueChange}
      max={this.props.limit}
      min={0 - this.props.limit}
    />
  );

  handlePreviousAnswerChange = ({ value: { id } }) => {
    const updateValidationRuleInput = {
      id: this.props.maxValue.id,
      maxValueInput: {
        inclusive: this.props.maxValue.inclusive,
        previousAnswer: id
      }
    };

    this.props.onUpdateAnswerValidation(updateValidationRuleInput);
  };

  handleCustomValueChange = ({ value }) => {
    // clamp value of input to +/- limit
    if (
      value !== "" &&
      !inRange(parseInt(value, 10), 0 - this.props.limit, this.props.limit + 1)
    ) {
      return false;
    }

    const intValue = parseInt(value, 10);

    const updateValidationRuleInput = {
      id: this.props.maxValue.id,
      maxValueInput: {
        inclusive: this.props.maxValue.inclusive,
        custom: isNaN(intValue) ? null : intValue
      }
    };

    this.props.onUpdateAnswerValidation(updateValidationRuleInput);
  };

  handleEntityTypeChange = value => {
    const updateValidationRuleInput = {
      id: this.props.maxValue.id,
      maxValueInput: {
        inclusive: this.props.maxValue.inclusive,
        entityType: value,
        previousAnswer: null,
        custom: null
      }
    };

    this.props.onUpdateAnswerValidation(updateValidationRuleInput);
  };

  handleToggleChange = ({ value }) => {
    const toggleValidationRuleInput = {
      id: this.props.maxValue.id,
      enabled: value
    };

    this.props.onToggleValidationRule(toggleValidationRuleInput);
  };

  handleIncludeChange = ({ value }) => {
    const updateValidationRuleInput = {
      id: this.props.maxValue.id,
      maxValueInput: {
        custom: this.props.maxValue.custom,
        inclusive: value
      }
    };
    this.props.onUpdateAnswerValidation(updateValidationRuleInput);
  };

  renderDisabled = () => (
    <DisabledMessage>Max value is disabled</DisabledMessage>
  );

  renderContent = () => {
    return (
      <Grid>
        <Column cols={3}>
          <ValidationTitle>Max Value is</ValidationTitle>
          <Connector />
        </Column>
        <Column cols={8}>
          <ValidationPills
            entityType={this.props.maxValue.entityType}
            onEntityTypeChange={this.handleEntityTypeChange}
            PreviousAnswer={this.PreviousAnswer}
            Custom={this.Custom}
          />
          <InlineField>
            <ToggleSwitch
              id="max-value-include"
              name="max-value-include"
              onChange={this.handleIncludeChange}
              checked={this.props.maxValue.inclusive}
            />
            <Label inline htmlFor="max-value-include">
              Include this number
            </Label>
          </InlineField>
        </Column>
      </Grid>
    );
  };

  render() {
    const { maxValue } = this.props;

    return (
      <ValidationView
        onToggleChange={this.handleToggleChange}
        enabled={maxValue.enabled}
        data-test="max-value-view"
      >
        {maxValue.enabled ? this.renderContent() : this.renderDisabled()}
      </ValidationView>
    );
  }
}

MaxValue.defaultProps = {
  limit: 999999999
};

MaxValue.propTypes = {
  maxValue: propType(MaxValueValidationRule).isRequired,
  answerType: PropTypes.oneOf(Object.values(answerTypes)).isRequired,
  onUpdateAnswerValidation: PropTypes.func.isRequired,
  onToggleValidationRule: PropTypes.func.isRequired,
  limit: PropTypes.number
};

const withQuestionPageEditing = flowRight(
  withApollo,
  withUpdateAnswerValidation,
  withToggleAnswerValidation
);

export const MaxValueWithAnswer = props => (
  <ValidationContext.Consumer>
    {({ answer }) => (
      <MaxValue
        maxValue={answer.validation.maxValue}
        answerType={answer.type}
        {...props}
      />
    )}
  </ValidationContext.Consumer>
);

export default withQuestionPageEditing(MaxValueWithAnswer);
