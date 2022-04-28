import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { colors } from "constants/theme";
import { calculatedSummaryErrors } from "constants/validationMessages";

import SelectedAnswer from "./SelectedAnswer";
import TextButton from "components/buttons/TextButton";
import Button from "components/buttons/Button";
import ValidationError from "components/ValidationError";

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

  const {
    validationErrorInfo: { errors },
  } = page;

  const handleRemoveAnswers = (answers) =>
    onUpdateCalculatedSummaryPage({
      id: page.id,
      summaryAnswers: selectedAnswers.filter(
        ({ id }) => !answers.find((answer) => answer.id === id)
      ),
    });

  return (
    <>
      <Header>
        <Title>
          {answerType} answers in {sectionTitle}
        </Title>
        <RemoveAllBtn onClick={() => handleRemoveAnswers(selectedAnswers)}>
          Remove all
        </RemoveAllBtn>
      </Header>
      <Body>
        <ErrorWrapper hasError={errors.length > 0 && findAnswersErrors(errors)}>
          {selectedAnswers.map((answer) => (
            <SelectedAnswer
              key={answer.id}
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
          Select another {answerType.toLowerCase() || ""} answer
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
