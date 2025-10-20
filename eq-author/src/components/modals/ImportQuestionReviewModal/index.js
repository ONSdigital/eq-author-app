import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors, radius, focusStyle, getTextHoverStyle } from "constants/theme";
import { stripHtmlToText } from "utils/stripHTML";

import Wizard, {
  Header,
  Heading,
  Subheading,
  Content,
  Warning,
  SpacedRow,
} from "components/modals/Wizard";
import Button from "components/buttons/Button";

const QuestionsPane = styled.div`
  max-height: 17em;
  overflow: hidden;
  overflow-y: scroll;
  margin-bottom: 0.5em;
`;

const QuestionContainer = styled.div`
  background-color: ${colors.blue};
  border-radius: ${radius};
  margin: 0 0 0.5em;
  color: ${colors.white};
  padding: 0.5em 1em;
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

const Container = styled.div`
  display: flex;
  gap: 0.5em;
`;

const WarningWrapper = styled.div`
  .warning-icon {
    margin-top: -1.1em;
  }
  .warning-flex-container {
    width: 40em;
  }
`;

const QuestionRow = ({ question: { alias, title, displayName }, onRemove }) => (
  <QuestionContainer>
    <SpacedRow>
      <div>
        <p>{alias}</p>
        <p>{stripHtmlToText(title) || displayName} </p>
      </div>
      <RemoveButton onClick={onRemove}>
        <span role="img" aria-label="Remove">
          ✕
        </span>
      </RemoveButton>
    </SpacedRow>
  </QuestionContainer>
);

QuestionRow.propTypes = {
  question: PropTypes.shape({
    alias: PropTypes.string,
    title: PropTypes.string.isRequired,
  }),
  onRemove: PropTypes.func.isRequired,
};

const ImportQuestionReviewModal = ({
  questionnaire,
  startingSelectedQuestions,
  isOpen,
  onConfirm,
  onCancel,
  onBack,
  onSelectQuestions,
  onSelectFolders,
  onSelectSections,
  onRemoveSingle,
  onRemoveAll,
}) => (
  <Wizard
    isOpen={isOpen}
    confirmText="Import"
    onConfirm={() => onConfirm(startingSelectedQuestions)}
    onCancel={onCancel}
    onBack={onBack}
    confirmEnabled={Boolean(startingSelectedQuestions?.length) || false}
  >
    <Header>
      <Heading> Import content from {questionnaire.title} </Heading>
      <Subheading>
        <WarningWrapper>
          <Warning>
            Question logic, piping and Q codes will not be imported. Any extra
            spaces in lines of text will be removed.
          </Warning>
        </WarningWrapper>
      </Subheading>
    </Header>
    <Content>
      {startingSelectedQuestions?.length ? (
        <>
          <SpacedRow>
            <ContentHeading>
              Question{startingSelectedQuestions.length > 1 ? "s" : ""} to
              import
            </ContentHeading>
            <RemoveAllButton onClick={onRemoveAll}>Remove all</RemoveAllButton>
          </SpacedRow>
          <QuestionsPane>
            {startingSelectedQuestions.map((question, index) => (
              <QuestionRow
                question={question}
                key={index}
                onRemove={() => onRemoveSingle(index)}
              />
            ))}
          </QuestionsPane>
        </>
      ) : (
        <ContentHeading>
          Select sections, folders or questions to import
        </ContentHeading>
      )}
      <Container>
        {startingSelectedQuestions?.length === 0 && (
          <Button
            onClick={onSelectSections}
            data-test="question-review-select-sections-button"
          >
            Sections
          </Button>
        )}
        {startingSelectedQuestions?.length === 0 && (
          <Button
            onClick={onSelectFolders}
            data-test="question-review-select-folders-button"
          >
            Folders
          </Button>
        )}
        <Button
          onClick={onSelectQuestions}
          data-test="question-review-select-questions-button"
        >
          {startingSelectedQuestions?.length >= 1
            ? "Select more questions"
            : "Questions"}
        </Button>
      </Container>
    </Content>
  </Wizard>
);

ImportQuestionReviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onSelectSections: PropTypes.func.isRequired,
  onSelectFolders: PropTypes.func.isRequired,
  onSelectQuestions: PropTypes.func.isRequired,
  onRemoveSingle: PropTypes.func.isRequired,
  onRemoveAll: PropTypes.func.isRequired,
  questionnaire: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }),
  startingSelectedQuestions: PropTypes.array, // eslint-disable-line
};

export default ImportQuestionReviewModal;
