import React from "react";
import PropTypes from "prop-types";
import { merge } from "lodash";
import CustomPropTypes from "custom-prop-types";

import {
  Required,
  Decimal,
  DateFormat
} from "components/AnswerProperties/Properties";
import {
  InlineField,
  MultiLineField
} from "components/AnswerProperties/Fields";

import { CURRENCY, DATE, NUMBER } from "constants/answer-types";

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
        {answer.type === NUMBER && (
          <InlineField id={this.getId("decimals", answer)} label={"Decimals"}>
            <Decimal
              id={this.getId("decimals", answer)}
              onChange={this.handleChange("decimals")}
              value={answer.properties.decimals}
            />
          </InlineField>
        )}
        {answer.type === CURRENCY && (
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
      </React.Fragment>
    );
  }
}

export default AnswerProperties;
