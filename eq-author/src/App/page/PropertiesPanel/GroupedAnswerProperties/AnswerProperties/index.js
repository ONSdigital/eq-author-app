import React from "react";
import { useMutation } from "@apollo/react-hooks";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { getOr } from "lodash/fp";

import updateAnswerMutation from "graphql/updateAnswer.graphql";

import { DateFormat, DurationProperties } from "./Properties";
import NumberProperties from "./Properties/NumberProperties";

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
  page: PropTypes.object, //eslint-disable-line
};

const DECIMAL_INCONSISTENCY = "ERR_REFERENCED_ANSWER_DECIMAL_INCONSISTENCY";

export const AnswerProperties = ({
  answer: { id, properties, validation, type },
  answer,
  page,
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
      {(type === answerTypes.NUMBER ||
        type === answerTypes.CURRENCY ||
        type === answerTypes.PERCENTAGE ||
        type === answerTypes.UNIT) && (
        <NumberProperties
          answer={answer}
          hasDecimalInconsistency={hasDecimalInconsistency}
          handleChange={handleChange("required")}
          page={page}
          getId={getId}
        />
      )}
      {type === answerTypes.DATE && (
        <DateFormat
          answer={answer}
          label="Date type"
          onChange={handleChange("format")}
          value={properties.format}
          getId={getId}
        />
      )}
      {type === answerTypes.DURATION && (
        <DurationProperties
          answer={answer}
          id="duration"
          onChange={({ value: unit }) => {
            handleChange(answer.type, {
              unit,
            });
          }}
          unit={answer.properties.unit}
          getId={getId}
        />
      )}
    </>
  );
};

AnswerProperties.propTypes = propTypes;

export default AnswerProperties;
