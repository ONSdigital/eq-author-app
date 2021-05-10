import React from "react";
import { useMutation } from "@apollo/react-hooks";
import CustomPropTypes from "custom-prop-types";

import updateAnswerMutation from "graphql/updateAnswer.graphql";

import InlineField from "../InlineField";
import { ToggleProperty, DateFormat } from "./Properties";
import MultiLineField from "../MultiLineField";

import { DATE, DATE_RANGE } from "constants/answer-types";
import { DAYS, MONTHS, YEARS } from "constants/durations";

const durationsMap = {
  "dd/mm/yyyy": DAYS,
  "mm/yyyy": MONTHS,
  yyyy: YEARS,
};

const getId = (name, id) => `answer-${id}-${name}`;

const propTypes = {
  answer: CustomPropTypes.answer.isRequired,
};

export const AnswerProperties = ({
  answer: { id, properties, validation, type },
}) => {
  const [onUpdateAnswer] = useMutation(updateAnswerMutation);

  const handleChange = (name) => ({ value }) => {
    onUpdateAnswer({
      variables: {
        input: {
          id,
          properties: { ...properties, [name]: value },
        },
      },
    });

    if ((type === DATE || type === DATE_RANGE) && name === "format") {
      validation.earliestDate.offset.unit = durationsMap[value];
      validation.latestDate.offset.unit = durationsMap[value];
    }
  };

  return (
    <>
      <InlineField id={getId("required", id)} label={"Required"}>
        <ToggleProperty
          data-test="answer-properties-required-toggle"
          id={getId("required", id)}
          onChange={handleChange("required")}
          value={properties.required}
        />
      </InlineField>
      {type === DATE && (
        <MultiLineField id={getId("date-format", id)} label={"Date type"}>
          <DateFormat
            id={getId("date-format", id)}
            onChange={handleChange("format")}
            value={properties.format}
          />
        </MultiLineField>
      )}
    </>
  );
};

AnswerProperties.propTypes = propTypes;

export default AnswerProperties;
