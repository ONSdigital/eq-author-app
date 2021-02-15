import React from "react";
import PropTypes from "prop-types";
import { flowRight, merge } from "lodash";
import CustomPropTypes from "custom-prop-types";

import { DATE, DATE_RANGE } from "constants/answer-types";
import { DAYS, MONTHS, YEARS } from "constants/durations";

import withUpdateAnswer from "App/page/Design/answers/withUpdateAnswer";
import withUpdateValidationRule from "App/page/Design/Validation/withUpdateValidationRule";
import InlineField from "../InlineField";

import { Required, DateFormat } from "./Properties";
import MultiLineField from "../MultiLineField";

const durationsMap = {
  "dd/mm/yyyy": DAYS,
  "mm/yyyy": MONTHS,
  yyyy: YEARS,
};

export class UnwrappedAnswerProperties extends React.Component {
  static propTypes = {
    answer: CustomPropTypes.answer.isRequired,
    onSubmit: PropTypes.func,
    onUpdateAnswer: PropTypes.func.isRequired,
    onUpdateValidationRule: PropTypes.func.isRequired,
  };

  handleChange = (propName) => ({ value }) => {
    const {
      id,
      properties: currentProperties,
      validation,
      type,
    } = this.props.answer;

    const properties = merge({}, currentProperties, {
      [propName]: value,
    });

    this.props.onUpdateAnswer({
      id,
      properties,
    });

    if ((type === DATE || type === DATE_RANGE) && propName === "format") {
      validation.earliestDate.offset.unit = durationsMap[value];
      validation.latestDate.offset.unit = durationsMap[value];
    }
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

export default flowRight(
  withUpdateValidationRule,
  withUpdateAnswer
)(UnwrappedAnswerProperties);
