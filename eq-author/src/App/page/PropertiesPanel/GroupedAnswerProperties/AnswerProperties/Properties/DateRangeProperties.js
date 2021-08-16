import React from "react";
import PropTypes from "prop-types";

import Collapsible from "components/Collapsible";

import MultiLineField from "../../MultiLineField";
import InlineField from "../../InlineField";
import { ToggleProperty } from ".";

import AnswerValidation from "App/page/Design/Validation/AnswerValidation";

const DateRangeProperties = ({ answer, onChange, getId }) => {
  const id = getId("date-range", answer.id);

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
      <MultiLineField id={id} label={"Validation settings"}>
        <AnswerValidation answer={answer} />
      </MultiLineField>
    </Collapsible>
  );
};

DateRangeProperties.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  getId: PropTypes.func,
  onChange: PropTypes.func,
};

export default DateRangeProperties;
