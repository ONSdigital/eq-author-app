import React from "react";
import PropTypes from "prop-types";
import { merge } from "lodash";
import CustomPropTypes from "custom-prop-types";
import { Field, Label } from "components/Forms";

import {
  Required,
  Decimal,
  DateFormat,
  MeasurementType,
  DurationType
} from "components/AnswerProperties/Properties";

import {
  InlineField,
  MultiLineField
} from "components/AnswerProperties/Fields";

import { DATE, NUMBER, MEASUREMENT, TIME } from "constants/answer-types";
import styled from "styled-components";

const DurationField = styled(Field)`
  margin: 0;
  &:not(:last-child) {
    margin-right: 0.5em;
  }
`;

const DurationFields = styled.div`
  display: flex;
`;

class AnswerProperties extends React.Component {
  static propTypes = {
    answer: CustomPropTypes.answer.isRequired,
    onSubmit: PropTypes.func,
    onUpdateAnswer: PropTypes.func.isRequired
  };

  handleChange = propName => ({ value }) => {
    const { id, properties: currentProperties } = this.props.answer;
    const properties = merge({}, currentProperties, {
      [propName]: value
    });

    this.props.onUpdateAnswer({
      id,
      properties
    });
  };

  handleTypeChange = ({ name, value }) => {
    this.props.changeType(name.match(/(\d+)/g)[0], value);
  };

  getId = (name, { id }) => `answer-${id}-${name}`;

  render() {
    const { answer } = this.props;

    return (
      <React.Fragment>
        <InlineField id={this.getId("required", answer)} label={"Required"}>
          <Required
            data-test="answer-properties-required-toggle"
            id={this.getId("required", answer)}
            onChange={this.handleChange("required")}
            value={answer.properties.required}
          />
        </InlineField>
        {answer.properties.unitType === MEASUREMENT && (
          <>
            <MultiLineField
              id={this.getId("numeric-type", answer)}
              label={"Type"}
            >
              <MeasurementType
                id={this.getId("numeric-type", answer)}
                onChange={this.handleTypeChange}
                type={answer.properties.type}
              />
            </MultiLineField>

            <InlineField id={this.getId("decimals", answer)} label={"Decimals"}>
              <Decimal
                id={this.getId("decimals", answer)}
                onChange={this.handleChange("decimals")}
                value={answer.properties.decimals}
              />
            </InlineField>
          </>
        )}
        {answer.properties.unitType === TIME && (
          <div>
            <Label bold={false}>Fields</Label>
            <DurationFields>
              <DurationField
                id={this.getId("duration-type", answer)}
                label={""}
              >
                <DurationType
                  id={this.getId("duration-type", answer)}
                  onChange={this.handleTypeChange}
                  type={answer.properties.type}
                />
              </DurationField>
              <DurationField
                id={this.getId("duration-type-1", answer)}
                label={""}
              >
                <DurationType
                  id={this.getId("duration-type-1", answer)}
                  onChange={this.handleTypeChange}
                  type={answer.properties.type}
                  hasNone
                />
              </DurationField>
              <DurationField
                id={this.getId("duration-type-2", answer)}
                label={""}
              >
                <DurationType
                  id={this.getId("duration-type-2", answer)}
                  onChange={this.handleTypeChange}
                  type={answer.properties.type}
                  hasNone
                />
              </DurationField>
            </DurationFields>
          </div>
        )}
        {answer.type === DATE && (
          <MultiLineField
            id={this.getId("date-format", answer)}
            label={"Date type"}
          >
            <DateFormat
              id={this.getId("date-format", answer)}
              onChange={this.handleChange("format")}
              value={answer.properties.format}
            />
          </MultiLineField>
        )}
      </React.Fragment>
    );
  }
}

export default AnswerProperties;
