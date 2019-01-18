import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { get, inRange, isNaN, noop } from "lodash";

import { Select } from "components/Forms/index";
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

import FieldWithInclude from "./FieldWithInclude";

const Connector = styled(PathEnd)`
  display: block;
  margin-left: auto;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const EqualsSelect = styled(Select)`
  width: 8em;
`;

const Pills = styled(ValidationPills)`
  margin-top: -2em;
`;

const Margin = styled.div`
  margin: 0 3em;
`;

export class TotalMinValue extends React.Component {
  PreviousAnswer = () => (
    <FieldWithInclude
      id="inclusive"
      name="inclusive"
      onChange={this.handleIncludeChange}
      checked={this.props.minValue.inclusive}
    >
      <PreviousAnswerContentPicker
        answerId={this.props.answerId}
        onSubmit={this.handlePreviousAnswerChange}
        selectedContentDisplayName={get(
          this.props.minValue.previousAnswer,
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
      checked={this.props.minValue.inclusive}
    >
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
    </FieldWithInclude>
  );

  handlePreviousAnswerChange = ({ value }) => {
    const updateValidationRuleInput = {
      id: this.props.minValue.id,
      validation: {
        inclusive: this.props.minValue.inclusive,
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
      id: this.props.minValue.id,
      validation: {
        inclusive: this.props.minValue.inclusive,
        custom: isNaN(intValue) ? null : intValue
      }
    };

    this.props.onUpdateAnswerValidation(updateValidationRuleInput);
  };

  handleEntityTypeChange = ({ value }) => {
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

    this.props.onUpdateAnswerValidation(toggleValidationRuleInput);
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

  handleEqualsChange = ({ value }) => {
    const updateValidationRuleInput = {
      id: this.props.minValue.id,
      validation: {
        comparator: value
      }
    };
    this.props.onUpdateAnswerValidation(updateValidationRuleInput);
  };

  renderDisabled = () => (
    <DisabledMessage>Total validation is disabled</DisabledMessage>
  );

  renderContent = () => {
    return (
      <Margin>
        <Grid>
          <Column cols={5}>
            <Flex>
              <ValidationTitle style={{ margin: "0 1em 0 0" }}>
                Total
              </ValidationTitle>

              <EqualsSelect
                onChange={this.handleEqualsChange}
                aria-label="Total"
                id="equals-select"
              >
                <option value="Equals">Equals</option>
                <option value="Less than">Less than</option>
              </EqualsSelect>
            </Flex>
            <Connector />
          </Column>
          <Column cols={7}>
            <Pills
              entityType={this.props.minValue.entityType}
              onEntityTypeChange={this.handleEntityTypeChange}
              PreviousAnswer={this.PreviousAnswer}
              Custom={this.Custom}
            />
          </Column>
        </Grid>
      </Margin>
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

TotalMinValue.defaultProps = {
  limit: 999999999
};

TotalMinValue.propTypes = {
  answerId: PropTypes.string.isRequired,
  onUpdateAnswerValidation: PropTypes.func.isRequired,
  onToggleValidationRule: PropTypes.func.isRequired,
  limit: PropTypes.number
};

export const TotalMinValueWithAnswer = props => (
  <ValidationContext.Consumer>
    {({ answer, ...rest }) => (
      <TotalMinValue
        answerId={answer.id}
        minValue={answer.validation.minValue}
        {...props}
        {...rest}
      />
    )}
  </ValidationContext.Consumer>
);

export default TotalMinValueWithAnswer;
