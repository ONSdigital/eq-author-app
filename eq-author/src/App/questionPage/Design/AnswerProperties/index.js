import React from "react";
import PropTypes from "prop-types";
import { merge } from "lodash";
import CustomPropTypes from "custom-prop-types";

import {
  Required,
  Decimal,
  DateFormat
} from "App/questionPage/Design/AnswerProperties/Properties";
import {
  InlineField,
  MultiLineField
} from "App/questionPage/Design/AnswerProperties/Fields";

import { CURRENCY, DATE, NUMBER } from "constants/answer-types";
import styled from "styled-components";

const Container = styled.div``;

class AnswerProperties extends React.Component {
  static propTypes = {
    answer: CustomPropTypes.answer.isRequired,
    onSubmit: PropTypes.func,
    onUpdateAnswer: PropTypes.func.isRequired
  };

  static defaultProps = {
    decimals: true,
    required: true
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

  getId = (name, { id }) => `answer-${id}-${name}`;

  render() {
    const { answer, decimals, required } = this.props;
    return (
      <Container>
        {required && (
          <InlineField id={this.getId("required", answer)} label={"Required"}>
            <Required
              data-test="answer-properties-required-toggle"
              id={this.getId("required", answer)}
              onChange={this.handleChange("required")}
              value={answer.properties.required}
            />
          </InlineField>
        )}
        {answer.type === NUMBER &&
          decimals && (
            <InlineField id={this.getId("decimals", answer)} label={"Decimals"}>
              <Decimal
                id={this.getId("decimals", answer)}
                onChange={this.handleChange("decimals")}
                value={answer.properties.decimals}
              />
            </InlineField>
          )}
        {answer.type === CURRENCY &&
          decimals && (
            <InlineField id={this.getId("decimals", answer)} label={"Decimals"}>
              <Decimal
                id={this.getId("decimals", answer)}
                onChange={this.handleChange("decimals")}
                value={answer.properties.decimals}
              />
            </InlineField>
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
      </Container>
    );
  }
}

export default AnswerProperties;
