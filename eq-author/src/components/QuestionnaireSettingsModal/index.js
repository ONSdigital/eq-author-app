import React from "react";
import Modal from "components/Modal";
import styled from "styled-components";
import DialogHeader from "components/Dialog/DialogHeader";
import { Message, Heading } from "components/Dialog/DialogMessage";
import PropTypes from "prop-types";
import QuestionnaireMeta from "components/QuestionnaireMeta";
import CustomPropTypes from "custom-prop-types";
import { noop } from "lodash";
import gql from "graphql-tag";

const defaultQuestionnaire = {
  title: "",
  description: "",
  surveyId: "",
  theme: "default",
  legalBasis: "StatisticsOfTradeAct",
  navigation: false
};

const CenteredHeading = styled(Heading)`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const StyledModal = styled(Modal)`
  width: 30em;
`;

const QuestionnaireSettingsModal = ({
  questionnaire,
  isOpen,
  onClose,
  onSubmit,
  confirmText
}) => (
  <StyledModal
    isOpen={isOpen}
    onClose={onClose}
    data={{ test: "questionnaire-settings-modal" }}
  >
    <DialogHeader>
      <Message>
        <CenteredHeading>Questionnaire settings</CenteredHeading>
      </Message>
    </DialogHeader>
    <QuestionnaireMeta
      questionnaire={questionnaire}
      onCancel={onClose}
      onSubmit={onSubmit}
      onUpdate={noop}
      confirmText={confirmText}
    />
  </StyledModal>
);

QuestionnaireSettingsModal.propTypes = {
  onSubmit: PropTypes.func,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  confirmText: PropTypes.string.isRequired,
  questionnaire: CustomPropTypes.questionnaire
};

QuestionnaireSettingsModal.defaultProps = {
  questionnaire: defaultQuestionnaire
};

QuestionnaireSettingsModal.fragments = {
  QuestionnaireSettingsModal: gql`
    fragment QuestionnaireSettingsModal on Questionnaire {
      ...Questionnaire
    }
    ${QuestionnaireMeta.fragments.Questionnaire}
  `
};

export default QuestionnaireSettingsModal;
