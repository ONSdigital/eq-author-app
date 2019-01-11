import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { get, inRange, isNaN, noop } from "lodash";

import { Field, Label } from "components/Forms/index";
import { Grid, Column } from "components/Grid/index";
import ToggleSwitch from "components/buttons/ToggleSwitch";

import PreviousAnswerContentPicker from "./PreviousAnswerContentPicker";
import DisabledMessage from "./DisabledMessage";
import { ValidationPills } from "./ValidationPills";
import ValidationTitle from "./ValidationTitle";
import ValidationView from "./ValidationView";
import ValidationContext from "./ValidationContext";
import ValidationInput from "./ValidationInput";
import PathEnd from "./path-end.svg?inline";

const InlineField = styled(Field)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: -0.8em;
`;

const Connector = styled(PathEnd)`
  margin-top: 0.75em;
`;

export class MinValue extends React.Component {
  PreviousAnswer = () => (
    <PreviousAnswerContentPicker
      answerId={this.props.answerId}
      onSubmit={this.handlePreviousAnswerChange}
      selectedContentDisplayName={get(
        this.props.minValue.previousAnswer,
        "displayName"
      )}
      path="answer.validation.minValue.availablePreviousAnswers"
    />
  );

  Custom = () => (
    <ValidationInput
      data-test="min-value-input"
      list="defaultNumbers"
      defaultValue={this.props.minValue.custom}
      type="number"
      onBlur={this.handleCustomValueChange}
      onChange={noop}
      max={this.props.limit}
      min={0 - this.props.limit}
    />
  );

  handlePreviousAnswerChange = ({ value: { id } }) => {
    const updateValidationRuleInput = {
      id: this.props.minValue.id,
      validation: {
        inclusive: this.props.minValue.inclusive,
        previousAnswer: id
      }
    };
    this.props.onUpdateAnswerValidation(updateValidationRuleInput);
  };

  handleCustomValueChange = ({ target: { value } }) => {
    // clamp value of input to +/- limit
    if (
      value !== "" &&
      !inRange(parseInt(value, 10), 0 - this.props.limit, this.props.limit + 1)
    ) {
      return false;
    }

    const intValue = parseInt(value, 10);

    const updateValidationRuleInput = {
      id: this.props.minValue.id,
      validation: {
        inclusive: this.props.minValue.inclusive,
        custom: isNaN(intValue) ? null : intValue
      }
    };

    this.props.onUpdateAnswerValidation(updateValidationRuleInput);
  };

  handleEntityTypeChange = value => {
    const updateValidationRuleInput = {
      id: this.props.minValue.id,
      validation: {
        inclusive: this.props.minValue.inclusive,
        entityType: value,
        previousAnswer: null,
        custom: null
      }
    };

    this.props.onUpdateAnswerValidation(updateValidationRuleInput);
  };

  handleToggleChange = ({ value }) => {
    const toggleValidationRuleInput = {
      id: this.props.minValue.id,
      enabled: value
    };

    this.props.onToggleValidationRule(toggleValidationRuleInput);
  };

  handleIncludeChange = ({ value }) => {
    const updateValidationRuleInput = {
      id: this.props.minValue.id,
      validation: {
        custom: this.props.minValue.custom,
        inclusive: value
      }
    };
    this.props.onUpdateAnswerValidation(updateValidationRuleInput);
  };

  renderDisabled = () => (
    <DisabledMessage>Min value is disabled</DisabledMessage>
  );

  renderContent = () => {
    return (
      <Grid>
        <Column cols={3}>
          <ValidationTitle>Min Value is</ValidationTitle>
          <Connector />
        </Column>
        <Column cols={8}>
          <ValidationPills
            entityType={this.props.minValue.entityType}
            onEntityTypeChange={this.handleEntityTypeChange}
            PreviousAnswer={this.PreviousAnswer}
            Custom={this.Custom}
          />
          <InlineField>
            <ToggleSwitch
              id="min-value-include"
              name="min-value-include"
              onChange={this.handleIncludeChange}
              checked={this.props.minValue.inclusive}
            />
            <Label inline htmlFor="min-value-include">
              Include this number
            </Label>
          </InlineField>
        </Column>
      </Grid>
    );
  };

  render() {
    const { minValue } = this.props;

    return (
      <ValidationView
        onToggleChange={this.handleToggleChange}
        enabled={minValue.enabled}
        data-test="min-value-view"
      >
        {minValue.enabled ? this.renderContent() : this.renderDisabled()}
      </ValidationView>
    );
  }
}

MinValue.defaultProps = {
  limit: 999999999
};

MinValue.propTypes = {
  answerId: PropTypes.string.isRequired,

  onUpdateAnswerValidation: PropTypes.func.isRequired,
  onToggleValidationRule: PropTypes.func.isRequired,
  limit: PropTypes.number
};

export const MaxValueWithAnswer = props => (
  <ValidationContext.Consumer>
    {({ answer, ...rest }) => (
      <MinValue
        answerId={answer.id}
        minValue={answer.validation.minValue}
        {...props}
        {...rest}
      />
    )}
  </ValidationContext.Consumer>
);

export default MaxValueWithAnswer;
