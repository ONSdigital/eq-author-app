import React from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/react-hooks";
import CustomPropTypes from "custom-prop-types";
import { getOr } from "lodash/fp";
import { colors } from "constants/theme";

import updateAnswerMutation from "graphql/updateAnswer.graphql";

import InlineField from "../InlineField";
import { ToggleProperty, DateFormat } from "./Properties";
import MultiLineField from "../MultiLineField";
import ValidationErrorIcon from "../validation-warning-icon.svg?inline";

import Collapsible from "components/Collapsible";
import IconText from "components/IconText";

import AnswerValidation from "App/page/Design/Validation/AnswerValidation";
import Decimal from "../Decimal";

import { characterErrors } from "constants/validationMessages";

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

  const ValidationWarning = styled(IconText)`
    color: ${colors.red};
    margin-top: 0.5em;
    justify-content: normal;
  `;

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
        <Collapsible
          title="Number properties"
          withoutHideThis
          variant="content"
        >
          <InlineField id={getId("required", id)} label={"Required"}>
            <ToggleProperty
              data-test="answer-properties-required-toggle"
              id={getId("required", id)}
              onChange={handleChange("required")}
              value={properties.required}
            />
          </InlineField>
          <InlineField id={id} label={"Decimals"}>
            <Decimal
              id={id}
              data-test="decimals"
              onBlur={(decimals) => {
                handleChange(type, {
                  decimals,
                });
              }}
              value={answer.properties.decimals}
              hasDecimalInconsistency={hasDecimalInconsistency}
            />
          </InlineField>
          {hasDecimalInconsistency && (
            <ValidationWarning icon={ValidationErrorIcon}>
              {characterErrors.DECIMAL_MUST_BE_SAME}
            </ValidationWarning>
          )}
          <AnswerValidation answer={answer} />
        </Collapsible>
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
