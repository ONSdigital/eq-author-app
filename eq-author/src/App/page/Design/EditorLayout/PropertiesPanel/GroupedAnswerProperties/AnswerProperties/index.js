import React from "react";
import PropTypes from "prop-types";
import { merge } from "lodash";
import CustomPropTypes from "custom-prop-types";

import { DATE } from "constants/answer-types";

import withUpdateAnswer from "App/page/Design/answers/withUpdateAnswer";

import InlineField from "../InlineField";

import { Required, DateFormat } from "./Properties";
import MultiLineField from "./MultiLineField";

export class UnwrappedAnswerProperties extends React.Component {
  static propTypes = {
    answer: CustomPropTypes.answer.isRequired,
    onSubmit: PropTypes.func,
    onUpdateAnswer: PropTypes.func.isRequired,
  };

  handleChange = propName => ({ value }) => {
    const { id, properties: currentProperties } = this.props.answer;
    const properties = merge({}, currentProperties, {
      [propName]: value,
    });

    this.props.onUpdateAnswer({
      id,
      properties,
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

export default withUpdateAnswer(UnwrappedAnswerProperties);
