import React from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/react-hooks";
import { groupBy, kebabCase, getOr } from "lodash/fp";
import { flatMap } from "lodash";
import getIdForObject from "utils/getIdForObject";

import Collapsible from "components/Collapsible";
import { Autocomplete } from "components/Autocomplete";
import IconText from "components/IconText";
import AnswerValidation from "App/page/Design/Validation/AnswerValidation";
import GroupValidations from "App/page/Design/Validation/GroupValidations";
import AnswerProperties from "./AnswerProperties";
import InlineField from "./InlineField";
import MultiLineField from "./MultiLineField";
import { Fallback } from "./Fallback";
import ValidationErrorIcon from "./validation-warning-icon.svg?inline";
import {
  DurationProperties,
  TextProperties,
} from "./AnswerProperties/Properties";
import Decimal from "./Decimal";

import updateAnswersOfTypeMutation from "graphql/updateAnswersOfType.graphql";

import { useQuestionnaire } from "components/QuestionnaireContext";

import {
  characterErrors,
  SELECTION_REQUIRED,
} from "constants/validationMessages";
import {
  CURRENCY,
  NUMBER,
  PERCENTAGE,
  UNIT,
  DURATION,
  TEXTAREA,
  DATE_RANGE,
} from "constants/answer-types";
import { unitConversion } from "constants/unit-types";
import { colors } from "constants/theme";

const AnswerPropertiesContainer = styled.div`
  border-bottom: 1px solid ${colors.lightMediumGrey};
  margin-bottom: 0.5em;
  padding-bottom: 0.5em;

  &:last-of-type {
    margin-bottom: 0.5em;
    border: 0;
  }
`;

const ValidationWarning = styled(IconText)`
  color: ${colors.red};
  margin-top: 0.5em;
  justify-content: normal;
`;

const ValidationWarningUnit = styled(ValidationWarning)`
  margin-top: -0.5em;
`;

const PropertiesOuter = styled.div`
  padding: 2em;
  background-color: pink;
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

const lengthErrors = {
  ERR_MAX_LENGTH_TOO_LARGE: {
    testId: "MaxCharacterTooBig",
    error: characterErrors.CHAR_LIMIT_2000_EXCEEDED,
  },
  ERR_MAX_LENGTH_TOO_SMALL: {
    testId: "MaxCharacterTooSmall",
    error: characterErrors.CHAR_MUST_EXCEED_9,
  },
};

const filterCondition = (x, query) =>
  x.unit.toLowerCase().includes(query.toLowerCase().trim()) ||
  x.abbreviation.toLowerCase().includes(query.toLowerCase().trim()) ||
  x.type.toLowerCase().includes(query.toLowerCase().trim()) ||
  query.toLowerCase().trim().startsWith(x.unit.toLowerCase()) ||
  query.toLowerCase().trim().startsWith(x.abbreviation.toLowerCase());

const filterUnitOptions = (options, query) => {
  const common = Object.values(options)
    .filter((x) => filterCondition(x, query))
    .map((option, index) => (
      <span key={`unit-option-${index}`} value={option.unit}>
        {option.unit} <span aria-hidden="true">({option.abbreviation})</span>
      </span>
    ));
  if (!query.length) {
    const categorized = flatMap(
      groupBy("type", unitConversion),
      (item, index) => [index, ...item]
    );
    const categories = categorized.map((option, index) =>
      typeof option === "string" ? (
        <span category="true">{option}</span>
      ) : (
        <span key={`unit-option-${index}`} value={option.unit}>
          {option.unit} <span aria-hidden="true">({option.abbreviation})</span>
        </span>
      )
    );
    return [common, categories];
  }

  return [common];
};

const isNumeric = (answerType) =>
  [NUMBER, PERCENTAGE, CURRENCY, UNIT].includes(answerType);

const lengthValueError = (errorCode) => {
  if (!lengthErrors[errorCode]) {
    return null;
  }

  const { testId, error } = lengthErrors[errorCode];

  return (
    <ValidationWarning icon={ValidationErrorIcon} data-test={testId}>
      {error}
    </ValidationWarning>
  );
};

export const GroupedAnswerProperties = ({ page }) => {
  const [updateAnswersOfType] = useMutation(updateAnswersOfTypeMutation);
  const { questionnaire } = useQuestionnaire();

  const handleChange = (type, properties) => {
    updateAnswersOfType({
      variables: { input: { type, questionPageId: page.id, properties } },
    });
  };

  const answersByType = groupBy("type", page.answers);

  return Object.keys(answersByType).map((answerType) => {
    let groupedFields = null;

    const answers = answersByType[answerType];

    if (isNumeric(answerType)) {
      const id = kebabCase(`${page.id} ${answerType} decimals`);

      const hasDecimalInconsistency = getOr(
        [],
        "validationErrorInfo.errors",
        answers[0]
      )
        .map(({ errorCode }) => errorCode)
        .includes(DECIMAL_INCONSISTENCY);

      const hasUnitError = getOr([], "validationErrorInfo.errors", page)
        .map(({ field }) => field)
        .includes("unit");

      groupedFields = (
        <GroupContainer>
          <InlineField id={id} label={"Decimals"}>
            <Decimal
              id={id}
              data-test="decimals"
              onBlur={(decimals) => {
                handleChange(answerType, {
                  decimals,
                });
              }}
              value={answers[0].properties.decimals}
              hasDecimalInconsistency={hasDecimalInconsistency}
            />
          </InlineField>
          {hasDecimalInconsistency && (
            <ValidationWarning icon={ValidationErrorIcon}>
              {characterErrors.DECIMAL_MUST_BE_SAME}
            </ValidationWarning>
          )}
          {answerType === UNIT && (
            <>
              <MultiLineField id="unit" label={"Type"}>
                <Autocomplete
                  options={unitConversion}
                  filter={filterUnitOptions}
                  placeholder={"Select a unit type"}
                  updateOption={(element) => {
                    handleChange(answerType, {
                      unit:
                        element && element.children[0]?.getAttribute("value"),
                    });
                  }}
                  hasError={hasUnitError}
                  defaultValue={
                    answers[0].properties.unit
                      ? `${answers[0].properties.unit} (${
                          unitConversion[answers[0].properties.unit]
                            .abbreviation
                        })`
                      : ""
                  }
                />
              </MultiLineField>
              {hasUnitError && (
                <ValidationWarningUnit
                  icon={ValidationErrorIcon}
                  data-test="unitRequired"
                >
                  {SELECTION_REQUIRED}
                </ValidationWarningUnit>
              )}
            </>
          )}
        </GroupContainer>
      );
    }
    if (answerType === DURATION) {
      groupedFields = (
        <GroupContainer>
          <MultiLineField id="duration" label={"Fields"}>
            <DurationProperties
              id="duration"
              onChange={({ value: unit }) => {
                handleChange(answerType, {
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
      const errors = answers[0]?.validationErrorInfo?.errors ?? [];
      const errorCode =
        errors
          .map(({ errorCode }) => errorCode)
          .find(
            (error) =>
              error === ERR_MAX_LENGTH_TOO_SMALL ||
              error === ERR_MAX_LENGTH_TOO_LARGE
          ) ?? false;

      groupedFields = (
        <GroupContainer>
          <InlineField id="maxCharactersField" label={"Max characters"}>
            <TextProperties
              id="maxCharactersInput"
              key={`${answers[0].id}-max-length-input`}
              maxLength={answers[0].properties.maxLength}
              pageId={page.id}
              invalid={Boolean(errorCode)}
            />
          </InlineField>
          {lengthValueError(errorCode)}
        </GroupContainer>
      );
    }

    return (
      <Collapsible
        className="propertiesCollapsible"
        title={`${answerType} properties`}
        variant="content"
        withoutHideThis
        key="answer"
      >
        <Padding>{groupedFields}</Padding>
        {answers.map((answer) => (
          <AnswerPropertiesContainer key={getIdForObject(answer)}>
            <Padding>
              <AnswerTitle data-test="answer-title">
                {answer.displayName}
              </AnswerTitle>
              <AnswerProperties answer={answer} />
              <AnswerValidation answer={answer} />

              {answer.type === DATE_RANGE ? (
                <Fallback
                  metadata={questionnaire && questionnaire.metadata}
                  answer={answer}
                  onChange={handleChange}
                />
              ) : null}
            </Padding>
          </AnswerPropertiesContainer>
        ))}
        {answers.length > 1 && answers[0].type !== UNIT && (
          <GroupContainer>
            <Padding>
              <GroupValidations
                totalValidation={page.totalValidation}
                validationError={page.validationErrorInfo}
                type={answerType}
              />
            </Padding>
          </GroupContainer>
        )}
      </Collapsible>
    );
  });
};

export default GroupedAnswerProperties;
