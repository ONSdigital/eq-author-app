import React from "react";
import styled from "styled-components";
import { groupBy, kebabCase, getOr } from "lodash/fp";

import Accordion from "components/Accordion";
import IconText from "components/IconText";
import {
  CURRENCY,
  NUMBER,
  PERCENTAGE,
  UNIT,
  DURATION,
  TEXTAREA,
} from "constants/answer-types";
import { colors } from "constants/theme";
import getIdForObject from "utils/getIdForObject";

import AnswerValidation from "App/page/Design/Validation/AnswerValidation";
import GroupValidations from "App/page/Design/Validation/GroupValidations";

import AnswerProperties from "./AnswerProperties";
import InlineField from "./InlineField";
import MultiLineField from "./MultiLineField";
import ValidationErrorIcon from "./validation-warning-icon.svg?inline";
import {
  UnitProperties,
  DurationProperties,
  TextProperties,
} from "./AnswerProperties/Properties";
import Decimal from "./Decimal";
import withUpdateAnswersOfType from "./withUpdateAnswersOfType";

const AnswerPropertiesContainer = styled.div`
  border-bottom: 1px solid ${colors.lightMediumGrey};
  margin-bottom: 0.5em;
  padding-bottom: 0.5em;

  &:last-of-type {
    margin-bottom: 0;
    border: 0;
  }
`;

const ValidationWarning = styled(IconText)`
  color: ${colors.red};
  margin-top: 0.5em;
  justify-content: normal;
`;

const Padding = styled.div`
  padding: 0 0.5em;
  min-height: 1em;
`;

const AnswerTitle = styled.h3`
  margin: 0;
  padding: 0;
  font-size: 1em;
  position: relative;
  color: #666;
`;

const GroupContainer = styled.div`
  padding: 0.5em 0;
`;

const DECIMAL_INCONSISTENCY = "ERR_REFERENCED_ANSWER_DECIMAL_INCONSISTENCY";
const ERR_MAX_LENGTH_TOO_LARGE = "ERR_MAX_LENGTH_TOO_LARGE";
const ERR_MAX_LENGTH_TOO_SMALL = "ERR_MAX_LENGTH_TOO_SMALL";

const isNumeric = answerType =>
  [NUMBER, PERCENTAGE, CURRENCY, UNIT].includes(answerType);

const showMaxLengthValError = (isMaxLengthTooLarge, isMaxLengthTooSmall) => {
  if (isMaxLengthTooLarge) {
    return (
      <ValidationWarning
        icon={ValidationErrorIcon}
        data-test="MaxCharacterTooBig"
      >
        Enter a character limit less than or equal to 2000
      </ValidationWarning>
    );
  }

  if (isMaxLengthTooSmall) {
    return (
      <ValidationWarning
        icon={ValidationErrorIcon}
        data-test="MaxCharacterTooSmall"
      >
        Enter a character limit greater than or equal to 10
      </ValidationWarning>
    );
  }
};

export const UnwrappedGroupedAnswerProperties = ({
  page,
  updateAnswersOfType,
}) => {
  const answersByType = groupBy("type", page.answers);
  return Object.keys(answersByType).map(answerType => {
    let groupedFields = null;
    let groupValidations = null;
    const answers = answersByType[answerType];

    const hasDecimalInconsistency = getOr(
      [],
      "validationErrorInfo.errors",
      answers[0]
    )
      .map(({ errorCode }) => errorCode)
      .includes(DECIMAL_INCONSISTENCY);
    if (isNumeric(answerType)) {
      const id = kebabCase(`${page.id} ${answerType} decimals`);
      groupedFields = (
        <GroupContainer>
          <InlineField id={id} label={"Decimals"}>
            <Decimal
              id={id}
              data-test="decimals"
              onBlur={decimals => {
                updateAnswersOfType(answerType, page.id, {
                  decimals,
                });
              }}
              value={answers[0].properties.decimals}
              hasDecimalInconsistency={hasDecimalInconsistency}
            />
          </InlineField>
          {hasDecimalInconsistency && (
            <ValidationWarning icon={ValidationErrorIcon}>
              Enter a decimal that is the same as the associated question page.
            </ValidationWarning>
          )}
          {answerType === UNIT && (
            <MultiLineField id="unit" label={"Type"}>
              <UnitProperties
                id="unit"
                onChange={({ value: unit }) => {
                  updateAnswersOfType(answerType, page.id, {
                    unit,
                  });
                }}
                unit={answers[0].properties.unit}
              />
            </MultiLineField>
          )}
        </GroupContainer>
      );

      if (answers.length > 1 && answers[0].type !== UNIT) {
        groupValidations = (
          <Padding>
            <GroupValidations
              totalValidation={page.totalValidation}
              type={answerType}
            />
          </Padding>
        );
      }
    }
    if (answerType === DURATION) {
      groupedFields = (
        <GroupContainer>
          <MultiLineField id="duration" label={"Fields"}>
            <DurationProperties
              id="duration"
              onChange={({ value: unit }) => {
                updateAnswersOfType(answerType, page.id, {
                  unit,
                });
              }}
              unit={answers[0].properties.unit}
            />
          </MultiLineField>
        </GroupContainer>
      );
    }

    if (answerType === TEXTAREA) {
      const isMaxLengthTooLarge = getOr(
        [],
        "validationErrorInfo.errors",
        answers[0]
      )
        .map(({ errorCode }) => errorCode)
        .includes(ERR_MAX_LENGTH_TOO_LARGE);

      const isMaxLengthTooSmall = getOr(
        [],
        "validationErrorInfo.errors",
        answers[0]
      )
        .map(({ errorCode }) => errorCode)
        .includes(ERR_MAX_LENGTH_TOO_SMALL);

      groupedFields = (
        <GroupContainer>
          <InlineField id="maxCharactersField" label={"Max characters"}>
            <TextProperties
              id="maxCharactersInput"
              key={`${answers[0].id}-max-length-input`}
              maxLength={parseInt(answers[0].properties.maxLength, 10)}
              pageId={page.id}
              invalid={isMaxLengthTooLarge || isMaxLengthTooSmall}
            />
          </InlineField>
          {showMaxLengthValError(isMaxLengthTooLarge, isMaxLengthTooSmall)}
        </GroupContainer>
      );
    }
    return (
      <Accordion
        title={`${answerType} Properties`.toUpperCase()}
        key={answerType}
      >
        <Padding>{groupedFields}</Padding>
        {answers.map(answer => {
          return (
            <AnswerPropertiesContainer key={getIdForObject(answer)}>
              <Padding>
                <AnswerTitle data-test="answer-title">
                  {answer.displayName}
                </AnswerTitle>
                <AnswerProperties answer={answer} />
                <AnswerValidation answer={answer} />
              </Padding>
            </AnswerPropertiesContainer>
          );
        })}
        {groupValidations}
      </Accordion>
    );
  });
};

export default withUpdateAnswersOfType(UnwrappedGroupedAnswerProperties);
