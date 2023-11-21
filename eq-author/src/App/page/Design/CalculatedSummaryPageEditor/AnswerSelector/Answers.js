import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { colors } from "constants/theme";
import { calculatedSummaryErrors } from "constants/validationMessages";

import SelectedAnswer from "./SelectedAnswer";
import TextButton from "components/buttons/TextButton";
import Button from "components/buttons/Button";
import ValidationError from "components/ValidationError";
import Modal from "components-themed/Modal/modal";
import {
  DELETE_ALL_CALC_SUM_ANSWERS_TITLE,
  DELETE_BUTTON_TEXT,
} from "constants/modal-content";

import { getPageByAnswerId } from "utils/questionnaireUtils";
import { useQuestionnaire } from "components/QuestionnaireContext";

const Title = styled.h3`
  font-weight: bold;
  font-size: 0.9em;
  color: ${colors.darkGrey};
  margin: 0;
`;

const RemoveAllBtn = styled(TextButton)`
  letter-spacing: 0.05rem;
  font-weight: bold;
  font-size: 0.8rem;
  margin: 0 0 0 auto;
`;

const SelectButton = styled(Button)`
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  margin-bottom: 1em;
`;

const Body = styled.div`
  margin-bottom: 1em;
`;

const ErrorWrapper = styled.div`
  ${(props) =>
    props.hasError &&
    `
      border: 2px solid ${colors.errorPrimary};
      padding: 1em;
    `}

  div:last-of-type {
    margin-bottom: 0;
  }
`;

const Footer = styled.div``;

// Function exported for testing
export const findAnswersErrors = (errors) => {
  return (
    errors.some((error) => error.errorCode === "ERR_NO_ANSWERS") ||
    errors.some(
      (error) => error.errorCode === "ERR_CALCULATED_UNIT_INCONSISTENCY"
    ) ||
    errors.some((error) => error.errorCode === "CALCSUM_MOVED")
  );
};

const Answers = ({ page, onUpdateCalculatedSummaryPage, onSelect }) => {
  const sectionTitle = page.section.displayName;
  const answerType = page.summaryAnswers[0].type;
  const selectedAnswers = page.summaryAnswers;

  const { questionnaire } = useQuestionnaire();

  const {
    validationErrorInfo: { errors },
  } = page;

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const selectedAnswersLeft = (answers) => {
    return selectedAnswers.filter(
      ({ id }) => !answers.find((answer) => answer.id === id)
    );
  };
  const handleRemoveAnswers = (answers) =>
    onUpdateCalculatedSummaryPage({
      id: page.id,
      summaryAnswers: selectedAnswersLeft(answers),
      type: selectedAnswersLeft(answers).length === 0 ? "" : answerType,
    });

  return (
    <>
      <Modal
        title={DELETE_ALL_CALC_SUM_ANSWERS_TITLE}
        positiveButtonText={DELETE_BUTTON_TEXT}
        isOpen={showDeleteModal}
        onConfirm={() => handleRemoveAnswers(selectedAnswers)}
        onClose={() => setShowDeleteModal(false)}
      />
      <Header>
        <Title>
          {answerType} answers in {sectionTitle}
        </Title>
        <RemoveAllBtn onClick={() => setShowDeleteModal(true)}>
          Remove all
        </RemoveAllBtn>
      </Header>
      <Body>
        <ErrorWrapper hasError={errors.length > 0 && findAnswersErrors(errors)}>
          {selectedAnswers.map((answer) => (
            <SelectedAnswer
              key={answer.id}
              insideListCollectorFolder={
                getPageByAnswerId(questionnaire, answer.id)?.folder?.listId !=
                null
              }
              {...answer}
              onRemove={() => handleRemoveAnswers([answer])}
            />
          ))}
        </ErrorWrapper>
        {errors.length > 0 && findAnswersErrors(errors) && (
          <ValidationError>
            {calculatedSummaryErrors[errors[0].errorCode]}
          </ValidationError>
        )}
      </Body>
      <Footer>
        <SelectButton variant="secondary" onClick={onSelect}>
          Select another {answerType.toLowerCase() || ""} answer or calculated
          summary total
        </SelectButton>
      </Footer>
    </>
  );
};

Answers.propTypes = {
  page: PropTypes.object.isRequired, // eslint-disable-line
  onUpdateCalculatedSummaryPage: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired, // eslint-disable-line
};

export default Answers;
