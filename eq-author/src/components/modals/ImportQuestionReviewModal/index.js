import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors, radius, focusStyle, getTextHoverStyle } from "constants/theme";
import Wizard, {
  Header,
  Heading,
  Subheading,
  Content,
  Warning,
  SpacedRow,
} from "components/modals/Wizard";
import Button from "components/buttons/Button";

const QuestionContainer = styled.div`
  background-color: ${colors.blue};
  border-radius: ${radius};
  margin: 0 0 0.5em;
  color: ${colors.white};
  padding: 0.5em 1em;
  &:last-of-type {
    margin-bottom: 1em;
  }
  p {
    margin: 0;
  }
`;

const commonButtonStyling = `
  background: transparent;
  border: none;
  cursor: pointer;
  &:focus {
    ${focusStyle}
  }
`;

const RemoveButton = styled.button`
  ${commonButtonStyling}
  color: ${colors.white};
  ${getTextHoverStyle(colors.white)}
`;

const RemoveAllButton = styled.button`
  ${commonButtonStyling}
  font-weight: bold;
  color: ${colors.blue};
  font-size: 1em;
  ${getTextHoverStyle(colors.blue)}
`;

const ContentHeading = styled.h4`
  margin: 1em 0;
  color: ${colors.textLight};
`;

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

QuestionRow.propTypes = {
  question: PropTypes.shape({
    alias: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  onRemove: PropTypes.func.isRequired,
};

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
      confirmEnabled={Boolean(selectedQuestions.length)}
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
              <ContentHeading>
                Question{selectedQuestions.length > 1 ? "s" : ""} to import
              </ContentHeading>
              <RemoveAllButton onClick={handleRemoveAll}>
                Remove all
              </RemoveAllButton>
            </SpacedRow>
            {selectedQuestions.map((question, index) => (
              <QuestionRow
                question={question}
                key={index}
                onRemove={() => removeQuestionAtIndex(index)}
              />
            ))}
          </>
        ) : (
          <ContentHeading> No questions selected. </ContentHeading>
        )}
        <Button onClick={handleSelectQuestions}>Select questions</Button>
      </Content>
    </Wizard>
  );
};

ImportQuestionReviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onSelectQuestions: PropTypes.func.isRequired,
  questionnaire: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }),
};

export default ImportQuestionReviewModal;
