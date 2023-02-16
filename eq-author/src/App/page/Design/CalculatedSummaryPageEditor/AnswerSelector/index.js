import React, { useMemo, useState } from "react";
import gql from "graphql-tag";
import styled from "styled-components";
import PropType from "prop-types";

import { colors } from "constants/theme";
import { NUMBER, CURRENCY, UNIT, PERCENTAGE } from "constants/answer-types";

import Answers from "./Answers";
import Empty from "./Empty";
import AnswerPicker from "components/AnswerPicker";

import { useQuestionnaire } from "components/QuestionnaireContext";
import getContentBeforeEntity from "utils/getContentBeforeEntity";
import getCalculatedSummaryPages from "utils/getCalculatedSummaryPages";

const Container = styled.div`
  border: 1px solid ${colors.grey};
  border-radius: 3px;
  padding: 1em;
  margin-bottom: 2em;
`;

export const filterAvailableAnswers = (entity) =>
  [CURRENCY, UNIT, PERCENTAGE, NUMBER].includes(entity.type) ? entity : [];

const AnswerSelector = ({ page, onUpdateCalculatedSummaryPage }) => {
  const [showPicker, setShowPicker] = useState(false);

  const { questionnaire } = useQuestionnaire();

  const calculatedSummaries = getCalculatedSummaryPages(
    questionnaire,
    page.section.id
  );

  const availableAnswers =
    (
      questionnaire &&
      getContentBeforeEntity({
        questionnaire,
        id: page.id,
        preprocessAnswers: filterAvailableAnswers,
      })
    )?.filter((section) => section.id === page.section.id) || [];

  const calculatedSummaryAnswers = [
    ...calculatedSummaries,
    ...availableAnswers,
  ];

  const availableSummaryAnswers = useMemo(
    () => calculatedSummaryAnswers,
    [questionnaire, page.id, page.section.id]
  );

  const handlePickerOpen = () => setShowPicker(true);
  const handlePickerClose = () => setShowPicker(false);
  const handlePickerSubmit = (answers) => {
    handlePickerClose();
    onUpdateCalculatedSummaryPage({
      id: page.id,
      summaryAnswers: answers,
      type: answers[0].type,
    });
  };

  return (
    <>
      <Container>
        {page.summaryAnswers.length > 0 ? (
          <Answers
            page={page}
            onUpdateCalculatedSummaryPage={onUpdateCalculatedSummaryPage}
            onSelect={handlePickerOpen}
          />
        ) : (
          <Empty
            page={page}
            availableSummaryAnswers={availableSummaryAnswers}
            onSelect={handlePickerOpen}
          />
        )}
      </Container>
      <AnswerPicker
        isOpen={showPicker}
        onClose={handlePickerClose}
        onSubmit={handlePickerSubmit}
        startingSelectedAnswers={page.summaryAnswers}
        data={availableSummaryAnswers}
        questionnaire={questionnaire}
        title="Select an answer or calculated summary total"
      />
    </>
  );
};

AnswerSelector.fragments = {
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
      type
    }
  `,
};

AnswerSelector.propTypes = {
  page: PropType.object.isRequired, // eslint-disable-line
  onUpdateCalculatedSummaryPage: PropType.func.isRequired,
};

export default AnswerSelector;
