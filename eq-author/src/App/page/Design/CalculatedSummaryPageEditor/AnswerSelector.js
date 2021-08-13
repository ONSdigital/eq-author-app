import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { propType } from "graphql-anywhere";
import gql from "graphql-tag";

import { colors } from "constants/theme";
import { MenuItemType } from "components/ContentPickerv2/Menu";
import AnswerPicker from "components/AnswerPicker";
import Button from "components/buttons/Button";
import TextButton from "components/buttons/TextButton";
import withValidationError from "enhancers/withValidationError";
import ValidationError from "components/ValidationError";
import {
  CALCSUM_ANSWER_NOT_SELECTED,
  CALCSUM_SUMMARY_ANSWERS_THE_SAME,
  buildLabelError,
} from "constants/validationMessages";

import getContentBeforeEntity from "utils/getContentBeforeEntity";
import { useQuestionnaire } from "components/QuestionnaireContext";

import { NUMBER, CURRENCY, UNIT, PERCENTAGE } from "constants/answer-types";

import AnswerChip from "./AnswerChip";
import iconInfo from "./icon-info.svg";

const Box = styled.div`
  border: 1px solid ${colors.borders};
  border-radius: 3px;
  margin-bottom: 2em;
  overflow: hidden;
`;

const RemoveAllButton = styled(TextButton)`
  letter-spacing: 0.05rem;
  font-weight: bold;
  font-size: 0.8rem;
  margin: 0 0 0 auto;
`;

const Answers = styled.div`
  padding: 1em;
`;

const SectionList = styled.ul`
  list-style: none;
  margin: 0 0 0.5em;
  padding: 0;
`;

const SectionListItem = styled.li`
  margin: 0;
`;

const SectionHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 0.7em;
`;

const SectionTitle = styled.div`
  font-weight: bold;
  font-size: 0.9em;
  color: #807d77;
`;

const AnswerList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-flow: row wrap;
`;

const AnswerListItem = styled.li`
  margin: 0 0 0.5em;
  width: 100%;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const SelectButton = styled(Button)`
  width: 100%;
`;

const Empty = styled.div`
  color: ${colors.calcSumEmptyContent};
  text-align: center;
  padding: 1em 2em;

  &::before {
    display: block;
    content: url(${iconInfo});
  }
`;

const EmptyTitle = styled.h3`
  font-size: 1em;
  margin: 0 0 0.5em;
`;

const EmptyButton = styled(Button)`
  padding: 0.5em 1em;
`;

const EmptyText = styled.div`
  font-size: 0.9em;
  margin-bottom: 1em;
`;

const ErrorButtonContainer = styled.div`
  border: 2px solid ${colors.errorPrimary};
  padding: 10px;
  position: relative;
`;

const ErrorContainer = styled.div`
  margin-left: 2em;
`;

const TypeChip = styled(MenuItemType)`
  color: ${colors.text};
  float: right;
`;

const ChipText = styled.div`
  max-width: 30em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  float: left;
`;

export const ErrorContext = styled.div`
  position: relative;

  ${(props) =>
    props.isInvalid &&
    css`
      margin-bottom: 2.5em;
      border: 2px solid ${colors.errorPrimary};
      padding: 1em;
    `}
`;

export const UnwrappedAnswerSelector = ({
  onUpdateCalculatedSummaryPage,
  page,
  getValidationError,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const { questionnaire } = useQuestionnaire();
  const { summaryAnswers } = page;

  const handleRemoveAnswers = (answers) =>
    onUpdateCalculatedSummaryPage({
      id: page.id,
      summaryAnswers: summaryAnswers.filter(
        ({ id }) => !answers.find((answer) => answer.id === id)
      ),
    });

  const handlePickerOpen = () => setShowPicker(true);
  const handlePickerClose = () => setShowPicker(false);

  const handlePickerSubmit = (answers) => {
    handlePickerClose();
    onUpdateCalculatedSummaryPage({
      id: page.id,
      summaryAnswers: answers,
    });
  };

  const renderAnswers = (answers, answerType) => {
    const unitInconsistencyError = getValidationError({
      field: "summaryAnswers",
      message: CALCSUM_SUMMARY_ANSWERS_THE_SAME,
    });

    const minOfTwoAnswersError = getValidationError({
      field: "summaryAnswers",
      message: CALCSUM_ANSWER_NOT_SELECTED,
    });

    const { section } = page;
    const unit = answers[0].properties.unit;

    return (
      <>
        <SectionList>
          <SectionListItem key={section.id}>
            <SectionHeader>
              <SectionTitle>
                {answerType} answers in {section.displayName}
              </SectionTitle>
              <RemoveAllButton
                data-test="remove-all"
                onClick={() => handleRemoveAnswers(answers)}
              >
                Remove all
              </RemoveAllButton>
            </SectionHeader>
            <ErrorContext
              isInvalid={unitInconsistencyError || minOfTwoAnswersError}
            >
              <AnswerList>
                {answers.map((answer) => (
                  <AnswerListItem key={answer.id}>
                    <AnswerChip onRemove={() => handleRemoveAnswers([answer])}>
                      <ChipText>{answer.displayName}</ChipText>
                      {answer.properties.unit && (
                        <TypeChip key={answer.properties.unit}>
                          {answer.properties.unit}
                        </TypeChip>
                      )}
                      <TypeChip key={answer.type}>{answer.type}</TypeChip>
                    </AnswerChip>
                  </AnswerListItem>
                ))}
              </AnswerList>
              {minOfTwoAnswersError && (
                <ValidationError>
                  {buildLabelError(
                    CALCSUM_ANSWER_NOT_SELECTED,
                    (unit || answers[0].type).toLowerCase(),
                    20,
                    19
                  )}
                </ValidationError>
              )}
            </ErrorContext>
          </SectionListItem>
        </SectionList>
        <SelectButton
          variant="secondary"
          onClick={handlePickerOpen}
          data-test="answer-selector"
        >
          Select another {answerType?.toLowerCase() || ""} answer
        </SelectButton>
      </>
    );
  };

  const renderEmptyState = (availableSummaryAnswers) => {
    const errorValidationMsg = getValidationError({
      field: "summaryAnswers",
      message: CALCSUM_ANSWER_NOT_SELECTED,
    });

    return (
      <>
        <Empty>
          <EmptyTitle>{`No answers ${
            availableSummaryAnswers.length ? "selected" : "available"
          }`}</EmptyTitle>
          <EmptyText>
            {availableSummaryAnswers.length
              ? "Select an answer using the button below."
              : "There are no answers to provide a calculated summary."}
          </EmptyText>
          <ErrorButtonContainer>
            <EmptyButton
              small
              onClick={handlePickerOpen}
              data-test="answer-selector-empty"
              disabled={!availableSummaryAnswers.length}
            >
              Select an answer
            </EmptyButton>
          </ErrorButtonContainer>
        </Empty>
        <ErrorContainer>
          <ValidationError>{errorValidationMsg}</ValidationError>
        </ErrorContainer>
      </>
    );
  };

  const availableSummaryAnswers = useMemo(
    () =>
      (
        questionnaire &&
        getContentBeforeEntity({
          questionnaire,
          id: page.id,
          preprocessAnswers: filterAvailableAnswers,
        })
      )?.filter((section) => section.id === page.section.id) || [],
    [questionnaire, page.id, page.section.id]
  );

  return (
    <Box>
      <Answers>
        {summaryAnswers.length
          ? renderAnswers(summaryAnswers, summaryAnswers?.[0]?.type)
          : renderEmptyState(availableSummaryAnswers)}
        <AnswerPicker
          isOpen={showPicker}
          onClose={handlePickerClose}
          onSubmit={handlePickerSubmit}
          startingSelectedAnswers={summaryAnswers}
          data={availableSummaryAnswers}
          title="Select one or more answer"
          showTypes
        />
      </Answers>
    </Box>
  );
};

export const filterAvailableAnswers = (entity) =>
  [CURRENCY, UNIT, PERCENTAGE, NUMBER].includes(entity.type) ? entity : [];

UnwrappedAnswerSelector.fragments = {
  AnswerSelector: gql`
    fragment AnswerSelector on CalculatedSummaryPage {
      id
      section {
        id
        displayName
      }
      summaryAnswers {
        id
        displayName
        type
        properties
      }
    }
  `,
};

UnwrappedAnswerSelector.propTypes = {
  onUpdateCalculatedSummaryPage: PropTypes.func.isRequired,
  page: propType(UnwrappedAnswerSelector.fragments.AnswerSelector),
  getValidationError: PropTypes.func.isRequired,
};

export default withValidationError("page")(UnwrappedAnswerSelector);
