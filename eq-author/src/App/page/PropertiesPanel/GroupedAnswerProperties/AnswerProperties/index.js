import React from "react";
import { useMutation } from "@apollo/react-hooks";
import CustomPropTypes from "custom-prop-types";
import { getOr } from "lodash/fp";

import updateAnswerMutation from "graphql/updateAnswer.graphql";

import { DateFormat } from "./Properties";
import NumberProperties from "./Properties/NumberProperties";
import MultiLineField from "../MultiLineField";

import * as answerTypes from "constants/answer-types";
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

const DECIMAL_INCONSISTENCY = "ERR_REFERENCED_ANSWER_DECIMAL_INCONSISTENCY";

export const AnswerProperties = ({
  answer: { id, properties, validation, type },
  answer,
}) => {
  const [onUpdateAnswer] = useMutation(updateAnswerMutation);

  const hasDecimalInconsistency = getOr(
    [],
    "validationErrorInfo.errors",
    answer
  )
    .map(({ errorCode }) => errorCode)
    .includes(DECIMAL_INCONSISTENCY);

  const handleChange =
    (name) =>
    ({ value }) => {
      onUpdateAnswer({
        variables: {
          input: {
            id,
            properties: { ...properties, [name]: value },
          },
        },
      });

      if (
        (type === answerTypes.DATE || type === answerTypes.DATE_RANGE) &&
        name === "format"
      ) {
        validation.earliestDate.offset.unit = durationsMap[value];
        validation.latestDate.offset.unit = durationsMap[value];
      }
    };

  return (
    <>
      {type === answerTypes.NUMBER && (
        <NumberProperties
          id={getId("required", id)}
          hasDecimalInconsistency={hasDecimalInconsistency}
          handleChange={handleChange("required")}
          answer={answer}
        />
      )}
      {type === answerTypes.DATE && (
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
