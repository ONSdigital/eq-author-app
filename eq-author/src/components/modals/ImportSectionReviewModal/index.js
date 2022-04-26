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

const SectionsPane = styled.div`
  max-height: 17em;
  overflow: hidden;
  overflow-y: scroll;
  margin-bottom: 0.5em;
`;

const SectionContainer = styled.div`
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

const SectionRow = ({ section: { alias, title, displayName }, onRemove }) => (
  <SectionContainer>
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
  </SectionContainer>
);

SectionRow.propTypes = {
  section: PropTypes.shape({
    alias: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    displayName: PropTypes.string,
  }),
  onRemove: PropTypes.func.isRequired,
};

const ImportSectionReviewModal = ({
  questionnaire,
  startingSelectedSections,
  isOpen,
  onConfirm,
  onCancel,
  onBack,
  onSelectQuestions,
  onSelectSections,
  onRemoveSingle,
  onRemoveAll,
}) => (
  <Wizard
    isOpen={isOpen}
    confirmText="Import"
    onConfirm={() => onConfirm(startingSelectedSections)}
    onCancel={onCancel}
    onBack={onBack}
    confirmEnabled={Boolean(startingSelectedSections?.length) || false}
  >
    <Header>
      <Heading> Import content from {questionnaire.title} </Heading>
      <Subheading>
        <Warning>
          Question logic, piping and Qcodes will not be imported.
        </Warning>
      </Subheading>
    </Header>
    <Content>
      {startingSelectedSections?.length ? (
        <>
          <SpacedRow>
            <ContentHeading>
              Question{startingSelectedSections.length > 1 ? "s" : ""} to import
            </ContentHeading>
            <RemoveAllButton onClick={onRemoveAll}>Remove all</RemoveAllButton>
          </SpacedRow>
          <SectionsPane>
            {startingSelectedSections.map((section, index) => (
              <SectionRow
                section={section}
                key={index}
                onRemove={() => onRemoveSingle(index)}
              />
            ))}
          </SectionsPane>
        </>
      ) : (
        <ContentHeading>
          *Select individual questions or entire sections to be imported, you
          cannot choose both*
        </ContentHeading>
      )}
      <Container>
        {startingSelectedSections?.length === 0 && (
          <Button
            onClick={onSelectQuestions}
            data-test="section-review-select-questions-button"
          >
            Questions
          </Button>
        )}
        <Button
          onClick={onSelectSections}
          data-test="section-review-select-sections-button"
        >
          {startingSelectedSections?.length >= 1
            ? "Select more sections"
            : "Sections"}
        </Button>
      </Container>
    </Content>
  </Wizard>
);

ImportSectionReviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onSelectQuestions: PropTypes.func.isRequired,
  onSelectSections: PropTypes.func.isRequired,
  onRemoveSingle: PropTypes.func.isRequired,
  onRemoveAll: PropTypes.func.isRequired,
  questionnaire: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }),
  startingSelectedSections: PropTypes.array, // eslint-disable-line
};

export default ImportSectionReviewModal;
