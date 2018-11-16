import React from "react";
import PropTypes from "prop-types";
import { merge } from "lodash";
import CustomPropTypes from "custom-prop-types";

import { connect } from "react-redux";

import {
  Required,
  Decimal,
  DateFormat,
  NumericType
} from "components/AnswerProperties/Properties";

import {
  InlineField,
  MultiLineField
} from "components/AnswerProperties/Fields";

import { DATE, NUMBER } from "constants/answer-types";
import { changeType, changeFormat } from "redux/answer/actions";
import { getUnit } from "redux/answer/reducer";

class UnwrappedAnswerProperties extends React.Component {
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

  handleFormatChange = ({ name, value }) => {
    this.props.changeFormat(name.match(/(\d+)/g)[0], value);
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
          <>
            <MultiLineField
              id={this.getId("numeric-type", answer)}
              label={"Type"}
            >
              <NumericType
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

const mapStateToProps = (state, ownProps) => ({
  answer: merge({}, ownProps.answer, {
    properties: getUnit(state, ownProps.answer.id, ownProps.answer.type)
  })
});

export default connect(
  mapStateToProps,
  { changeType, changeFormat }
)(UnwrappedAnswerProperties);
