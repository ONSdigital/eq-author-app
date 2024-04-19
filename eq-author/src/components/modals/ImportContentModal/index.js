import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";

import Wizard, {
  Header,
  Heading,
  Subheading,
  Content,
  Warning,
} from "components/modals/Wizard";
import Button from "components/buttons/Button";

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

const ImportQuestionReviewModal = ({
  questionnaire,
  isOpen,
  onCancel,
  onBack,
  onSelectQuestions,
  onSelectFolders,
  onSelectSections,
}) => (
  <Wizard
    isOpen={isOpen}
    confirmText="Import"
    onConfirm={() => {}}
    onCancel={onCancel}
    onBack={onBack}
    confirmEnabled={false}
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
      <ContentHeading>
        Select sections, folders or questions to import
      </ContentHeading>

      <Container>
        <Button
          onClick={onSelectSections}
          data-test="content-modal-select-sections-button"
        >
          Sections
        </Button>
        <Button
          onClick={onSelectFolders}
          data-test="content-modal-select-folders-button"
        >
          Folders
        </Button>
        <Button
          onClick={onSelectQuestions}
          data-test="content-modal-select-questions-button"
        >
          Questions
        </Button>
      </Container>
    </Content>
  </Wizard>
);

ImportQuestionReviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onSelectQuestions: PropTypes.func.isRequired,
  onSelectFolders: PropTypes.func.isRequired,
  onSelectSections: PropTypes.func.isRequired,
  questionnaire: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }),
  startingSelectedQuestions: PropTypes.array, // eslint-disable-line
};

export default ImportQuestionReviewModal;
