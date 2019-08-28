import React from "react";
import styled from "styled-components";
import { groupBy, kebabCase } from "lodash/fp";

import Accordion from "components/Accordion";
import {
  CURRENCY,
  NUMBER,
  PERCENTAGE,
  UNIT,
  DURATION,
} from "constants/answer-types";
import { colors } from "constants/theme";
import getIdForObject from "utils/getIdForObject";

import AnswerValidation from "App/page/Design/Validation/AnswerValidation";
import GroupValidations from "App/page/Design/Validation/GroupValidations";

import AnswerProperties from "./AnswerProperties";
import InlineField from "./InlineField";
import MultiLineField from "./MultiLineField";
import {
  UnitProperties,
  DurationProperties,
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

const isNumeric = answerType =>
  [NUMBER, PERCENTAGE, CURRENCY, UNIT].includes(answerType);

export const UnwrappedGroupedAnswerProperties = ({
  page,
  updateAnswersOfType,
}) => {
  const answersByType = groupBy("type", page.answers);

  return Object.keys(answersByType).map(answerType => {
    let groupedFields = null;
    let groupValidations = null;
    const answers = answersByType[answerType];

    if (isNumeric(answerType)) {
      const id = kebabCase(`${answerType} decimals`);
      groupedFields = (
        <GroupContainer>
          <InlineField id={id} label={"Decimals"}>
            <Decimal
              id={id}
              data-test="decimals"
              onChange={({ value: decimals }) => {
                updateAnswersOfType(answerType, page.id, {
                  decimals,
                });
              }}
              value={answers[0].properties.decimals}
            />
          </InlineField>
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

    return (
      <Accordion
        title={`${answerType} Properties`.toUpperCase()}
        key={answerType}
      >
        <Padding>{groupedFields}</Padding>
        {answers.map(answer => (
          <AnswerPropertiesContainer key={getIdForObject(answer)}>
            <Padding>
              <AnswerTitle data-test="answer-title">
                {answer.displayName}
              </AnswerTitle>
              <AnswerProperties answer={answer} />
              <AnswerValidation answer={answer} />
            </Padding>
          </AnswerPropertiesContainer>
        ))}
        {groupValidations}
      </Accordion>
    );
  });
};

export default withUpdateAnswersOfType(UnwrappedGroupedAnswerProperties);
