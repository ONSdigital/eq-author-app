import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { propType } from "graphql-anywhere";
import { get, inRange, isNaN, noop } from "lodash";

import { Field, Label } from "components/Forms/index";
import { Grid, Column } from "components/Grid/index";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import FieldWithInclude from "./FieldWithInclude";
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

export class TotalMaxValue extends React.Component {
  PreviousAnswer = () => (
    <FieldWithInclude
      id="inclusive"
      name="inclusive"
      onChange={this.handleIncludeChange}
      checked={this.props.maxValue.inclusive}
    >
      <PreviousAnswerContentPicker
        answerId={this.props.answerId}
        onSubmit={this.handlePreviousAnswerChange}
        selectedContentDisplayName={get(
          this.props.maxValue.previousAnswer,
          "displayName"
        )}
        path="answer.validation.maxValue.availablePreviousAnswers"
      />
    </FieldWithInclude>
  );

  Custom = () => (
    <FieldWithInclude
      id="inclusive"
      name="inclusive"
      onChange={this.handleIncludeChange}
      checked={this.props.maxValue.inclusive}
    >
      <ValidationInput
        data-test="max-value-input"
        list="defaultNumbers"
        defaultValue={this.props.maxValue.custom}
        type="number"
        onBlur={this.handleCustomValueChange}
        onChange={noop}
        max={this.props.limit}
        min={0 - this.props.limit}
      />
    </FieldWithInclude>
  );

  handlePreviousAnswerChange = ({ value }) => {
    const updateValidationRuleInput = {
      id: this.props.maxValue.id,
      validation: {
        inclusive: this.props.maxValue.inclusive,
        previousAnswer: value
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
      id: this.props.maxValue.id,
      validation: {
        inclusive: this.props.maxValue.inclusive,
        custom: isNaN(intValue) ? null : intValue
      }
    };

    this.props.onUpdateAnswerValidation(updateValidationRuleInput);
  };

  handleEntityTypeChange = ({ value }) => {
    const updateValidationRuleInput = {
      id: this.props.maxValue.id,
      validation: {
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
      validation: {
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
    const entityType = this.props.maxValue.entityType;

    return (
      <Grid>
        <Column cols={3}>
          <ValidationTitle>Max Value is</ValidationTitle>
          <Connector />
        </Column>
        <Column cols={8}>
          <ValidationPills
            entityType={entityType}
            onEntityTypeChange={this.handleEntityTypeChange}
            PreviousAnswer={this.PreviousAnswer}
            Custom={this.Custom}
          />
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

TotalMaxValue.defaultProps = {
  limit: 999999999
};

TotalMaxValue.propTypes = {
  answerId: PropTypes.string.isRequired,
  onUpdateAnswerValidation: PropTypes.func.isRequired,
  onToggleValidationRule: PropTypes.func.isRequired,
  limit: PropTypes.number
};

export const TotalMaxValueWithAnswer = props => (
  <ValidationContext.Consumer>
    {({ answer, ...rest }) => (
      <TotalMaxValue
        answerId={answer.id}
        maxValue={answer.validation.maxValue}
        {...props}
        {...rest}
      />
    )}
  </ValidationContext.Consumer>
);

export default TotalMaxValueWithAnswer;
