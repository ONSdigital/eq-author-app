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

const ImportQuestionReviewModal = ({
  questionnaire,
  isOpen,
  onCancel,
  onBack,
  onSelectQuestions,
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
        <Warning>
          Question logic, piping and Qcodes will not be imported.
        </Warning>
      </Subheading>
    </Header>
    <Content>
      <ContentHeading>
        *Select individual questions or entire sections to be imported, you
        cannot choose both*
      </ContentHeading>

      <Container>
        <Button
          onClick={onSelectQuestions}
          data-test="content-modal-select-questions-button"
        >
          Questions
        </Button>
        <Button
          onClick={onSelectSections}
          data-test="content-modal-select-sections-button"
        >
          Sections
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
  onSelectQuestions: PropTypes.func.isRequired,
  onSelectSections: PropTypes.func.isRequired,
  questionnaire: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }),
  startingSelectedQuestions: PropTypes.array, // eslint-disable-line
};

export default ImportQuestionReviewModal;
