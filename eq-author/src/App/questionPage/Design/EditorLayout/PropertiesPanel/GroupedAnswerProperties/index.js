import React from "react";
import styled from "styled-components";
import { groupBy, kebabCase } from "lodash/fp";

import Accordion from "components/Accordion";
import { CURRENCY, NUMBER, PERCENTAGE } from "constants/answer-types";
import getIdForObject from "utils/getIdForObject";

import AnswerValidation from "App/questionPage/Design/Validation/AnswerValidation";

import AnswerProperties from "./AnswerProperties";
import InlineField from "./InlineField";
import Decimal from "./Decimal";
import withUpdateAnswersOfType from "./withUpdateAnswersOfType";

const AnswerPropertiesContainer = styled.div`
  padding: 0.5em;
`;

const AnswerTitle = styled.h3`
  margin: 0;
  padding: 0;
  font-size: 1em;
  position: relative;
  color: #666;
`;

const GroupContainer = styled.div`
  padding-bottom: 0.5em;
`;

const isNumeric = answerType =>
  [NUMBER, PERCENTAGE, CURRENCY].includes(answerType);

export const UnwrappedGroupedAnswerProperties = ({
  page,
  updateAnswersOfType,
}) => {
  const answersByType = groupBy("type", page.answers);

  return Object.keys(answersByType).map(answerType => {
    let groupedFields = null;
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
        </GroupContainer>
      );
    }

    return (
      <Accordion
        title={`${answerType} Properties`.toUpperCase()}
        key={answerType}
      >
        <AnswerPropertiesContainer>
          {groupedFields}
          {answers.map(answer => (
            <React.Fragment key={getIdForObject(answer)}>
              <AnswerTitle data-test="answer-title">
                {answer.displayName}
              </AnswerTitle>
              <AnswerProperties answer={answer} />
              <AnswerValidation answer={answer} />
            </React.Fragment>
          ))}
        </AnswerPropertiesContainer>
      </Accordion>
    );
  });
};

export default withUpdateAnswersOfType(UnwrappedGroupedAnswerProperties);
