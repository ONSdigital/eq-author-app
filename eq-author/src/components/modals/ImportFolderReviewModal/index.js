import React from "react";
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

const FoldersPane = styled.div`
  max-height: 17em;
  overflow: hidden;
  overflow-y: scroll;
  margin-bottom: 0.5em;
`;

const FolderContainer = styled.div`
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

const FolderRow = ({ folder: { alias, title, displayName }, onRemove }) => (
  <FolderContainer>
    <SpacedRow>
      <div>
        <p>{title && alias}</p>
        <p>{title || displayName} </p>
      </div>
      <RemoveButton onClick={onRemove}>
        <span role="img" aria-label="Remove">
          ✕
        </span>
      </RemoveButton>
    </SpacedRow>
  </FolderContainer>
);

FolderRow.propTypes = {
  folder: PropTypes.shape({
    alias: PropTypes.string,
    title: PropTypes.string,
    displayName: PropTypes.string,
  }),
  onRemove: PropTypes.func.isRequired,
};

const ImportFolderReviewModal = ({
  questionnaire,
  startingSelectedFolders,
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
    onConfirm={() => onConfirm(startingSelectedFolders)}
    onCancel={onCancel}
    onBack={onBack}
    confirmEnabled={Boolean(startingSelectedFolders?.length) || false}
  >
    <Header>
      <Heading> Import content from {questionnaire.title} </Heading>
      <Subheading>
        <WarningWrapper>
          <Warning>
            Question logic, piping and Qcodes will not be imported. Any extra
            spaces in lines of text will be removed.
          </Warning>
        </WarningWrapper>
      </Subheading>
    </Header>
    <Content>
      {startingSelectedFolders?.length ? (
        <>
          <SpacedRow>
            <ContentHeading>
              Folder{startingSelectedFolders.length > 1 && "s"} to import
            </ContentHeading>
            <RemoveAllButton onClick={onRemoveAll}>Remove all</RemoveAllButton>
          </SpacedRow>
          <FoldersPane>
            {startingSelectedFolders.map((folder, index) => (
              <FolderRow
                folder={folder}
                key={index}
                onRemove={() => onRemoveSingle(index)}
              />
            ))}
          </FoldersPane>
        </>
      ) : (
        <ContentHeading>
          Select sections, folders or question to import
        </ContentHeading>
      )}
      <Container>
        {startingSelectedFolders?.length === 0 && (
          <Button
            onClick={onSelectSections}
            data-test="folder-review-select-sections-button"
          >
            Sections
          </Button>
        )}
        <Button
          onClick={onSelectFolders}
          data-test="folder-review-select-folders-button"
        >
          {startingSelectedFolders?.length >= 1
            ? "Select more folders"
            : "Folders"}
        </Button>
        {startingSelectedFolders?.length === 0 && (
          <Button
            onClick={onSelectQuestions}
            data-test="folder-review-select-questions-button"
          >
            Questions
          </Button>
        )}
      </Container>
    </Content>
  </Wizard>
);

ImportFolderReviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onSelectQuestions: PropTypes.func.isRequired,
  onSelectFolders: PropTypes.func.isRequired,
  onSelectSections: PropTypes.func.isRequired,
  onRemoveSingle: PropTypes.func.isRequired,
  onRemoveAll: PropTypes.func.isRequired,
  questionnaire: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }),
  startingSelectedFolders: PropTypes.array, // eslint-disable-line
};

export default ImportFolderReviewModal;
