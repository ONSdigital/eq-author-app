import React from "react";
import { useMutation } from "@apollo/react-hooks";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { getOr } from "lodash/fp";

import updateAnswerMutation from "graphql/updateAnswer.graphql";

import Collapsible from "components/Collapsible";
import Required from "components/AdditionalContent/Required";
import {
  DateProperties,
  DurationProperties,
} from "components/AdditionalContent/AnswerProperties/Answers";
import NumberProperties from "components/AdditionalContent/AnswerProperties/Answers/NumberProperties";
import DateRangeProperties from "components/AdditionalContent/AnswerProperties/Answers/DateRangeProperties";
import TextAreaProperties from "components/AdditionalContent/AnswerProperties/Answers/TextAreaProperties";

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

  const handleDecimalChange = (name) => (value) => {
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
          handleDecimalChange={handleDecimalChange("decimals")}
          page={page}
          getId={getId}
        />
      )}
      {type === answerTypes.DATE && (
        <DateProperties
          answer={answer}
          onChange={handleChange("format")}
          handleRequiredChange={handleChange("required")}
          value={properties.format}
          getId={getId}
        />
      )}
      {type === answerTypes.DURATION && (
        <DurationProperties
          answer={answer}
          onChange={handleChange("unit")}
          handleRequiredChange={handleChange("required")}
          unit={answer.properties.unit}
          getId={getId}
        />
      )}
      {type === answerTypes.DATE_RANGE && (
        <DateRangeProperties
          answer={answer}
          onChange={handleChange("required")}
          getId={getId}
        />
      )}
      {type === answerTypes.TEXTAREA && (
        <TextAreaProperties
          answer={answer}
          onChange={handleChange("required")}
          page={page}
          getId={getId}
        />
      )}
      {type === answerTypes.TEXTFIELD && (
        <Collapsible
          variant="properties"
          title={`Text field properties`}
          withoutHideThis
        >
          <Required
            answer={answer}
            onChange={handleChange("required")}
            getId={getId}
          />
        </Collapsible>
      )}
      {(type === answerTypes.RADIO || type === answerTypes.CHECKBOX) && (
        <Collapsible
          variant="properties"
          title={`${answer.type} properties`}
          withoutHideThis
        >
          <Required
            answer={answer}
            onChange={handleChange("required")}
            getId={getId}
          />
        </Collapsible>
      )}
    </>
  );
};

AnswerProperties.propTypes = propTypes;

export default AnswerProperties;
