import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors, radius } from "constants/theme";
import Wizard, {
  Header,
  Heading,
  Subheading,
  Content,
  Warning,
} from "components/modals/Wizard";
import Button from "components/buttons/Button";

const QuestionContainer = styled.div`
  background-color: ${colors.blue};
  border-radius: ${radius};
  margin: 0.5em 0;
  color: ${colors.white};
  padding: 0.5em 1em;
  &:last-of-type {
    margin-bottom: 1.5em;
  }
  p {
    margin: 0;
  }
`;

const SpacedRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const commonButtonStyling = `
  background: transparent;
  border: none;
  cursor: pointer;
`;

const RemoveButton = styled.button`
  ${commonButtonStyling}
  color: ${colors.white};
`;

const RemoveAllButton = styled.button`
  ${commonButtonStyling}
  font-weight: bold;
  color: ${colors.blue};
  font-size: 1em;
`;

const dummyQuestions = [
  { alias: "Q1", title: "How many roads must a man walk down?" },
  { alias: "Q2", title: "What is the airspeed velocity of a swallow?" },
  { alias: "Q3", title: "What is your favourite colour?" },
];

const QuestionRow = ({ question: { alias, title }, onRemove }) => {
  return (
    <QuestionContainer>
      <SpacedRow>
        <div>
          <p>{alias}</p>
          <p>{title}</p>
        </div>
        <RemoveButton onClick={onRemove}>
          <span role="img" aria-label="Remove">
            ✕
          </span>
        </RemoveButton>
      </SpacedRow>
    </QuestionContainer>
  );
};

const ContentHeading = styled.h4`
  margin: 1em 0;
  color: ${colors.textLight};
`;

const ImportQuestionReviewModal = ({
  isOpen,
  onConfirm,
  onCancel,
  onBack,
  onSelectQuestions, // (questionnaire, callback) -> void
  questionnaire,
}) => {
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const handleSelectQuestions = () =>
    onSelectQuestions(questionnaire, setSelectedQuestions);

  const removeQuestionAtIndex = (index) =>
    setSelectedQuestions((questions) =>
      questions.filter((_, i) => i !== index)
    );

  const handleRemoveAll = () => setSelectedQuestions([]);

  return (
    <Wizard
      isOpen={isOpen}
      confirmText="Import"
      onConfirm={() => onConfirm(selectedQuestions)}
      onCancel={onCancel}
      onBack={onBack}
    >
      <Header>
        <Heading> Import questions from {questionnaire.title} </Heading>
        <Subheading>
          <Warning>
            Question logic, piping and Qcodes will not be imported.
          </Warning>
        </Subheading>
      </Header>
      <Content>
        {selectedQuestions.length ? (
          <>
            <SpacedRow>
              <ContentHeading> Questions to import </ContentHeading>
              <RemoveAllButton onClick={handleRemoveAll}>
                Remove all
              </RemoveAllButton>
            </SpacedRow>
            {selectedQuestions.map((question, index) => (
              <QuestionRow
                question={question}
                onRemove={() => removeQuestionAtIndex(index)}
              />
            ))}
          </>
        ) : (
          <ContentHeading> No questions selected </ContentHeading>
        )}
        <Button onClick={handleSelectQuestions}>Select questions</Button>
      </Content>
    </Wizard>
  );
};

export default ImportQuestionReviewModal;
