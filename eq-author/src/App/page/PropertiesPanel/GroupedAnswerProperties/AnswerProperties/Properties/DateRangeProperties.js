import React from "react";
import PropTypes from "prop-types";

import Collapsible from "components/Collapsible";

import MultiLineField from "../../MultiLineField";
import InlineField from "../../InlineField";
import { ToggleProperty } from "../Properties";

import AnswerValidation from "App/page/Design/Validation/AnswerValidation";

const DateRangeProperties = ({ answer, onChange, getId }) => {
  const id = getId("duration", answer.id);

  return (
    <Collapsible
      variant="content"
      title={`Date range properties`}
      withoutHideThis
    >
      <InlineField id={id} label={"Answer required"}>
        <ToggleProperty
          data-test="answer-properties-required-toggle"
          id={id}
          onChange={onChange}
          value={answer.properties.required}
        />
      </InlineField>
      <MultiLineField
        id={getId("date-format", answer.id)}
        label={"Validation settings"}
      >
        <AnswerValidation answer={answer} />
      </MultiLineField>
    </Collapsible>
  );
};

DateRangeProperties.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  value: PropTypes.string.isRequired,
  getId: PropTypes.func,
  onChange: PropTypes.func,
};

export default DateRangeProperties;
