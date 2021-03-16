import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import gql from "graphql-tag";
import { noop } from "lodash";

import { useQuestionnaire } from "components/QuestionnaireContext";

import DialogHeader from "components/Dialog/DialogHeader";
import { Message, Heading } from "components/Dialog/DialogMessage";
import Modal from "components/modals/Modal";
import QuestionnaireMeta from "./QuestionnaireMeta";

const defaultQuestionnaire = {
  title: "",
  description: "",
  surveyId: "",
  theme: "default",
  navigation: false,
};

const CenteredHeading = styled(Heading)`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const StyledModal = styled(Modal)`
  .Modal {
    width: 37em;
  }
`;

const QuestionnaireSettingsModal = ({
  isOpen,
  onClose,
  onSubmit,
  confirmText,
  canEditType,
}) => {
  const { questionnaire } = useQuestionnaire();
  return (
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
        questionnaire={questionnaire || defaultQuestionnaire}
        onCancel={onClose}
        onSubmit={onSubmit}
        onUpdate={noop}
        confirmText={confirmText}
        canEditType={canEditType}
      />
    </StyledModal>
  );
};

QuestionnaireSettingsModal.propTypes = {
  onSubmit: PropTypes.func,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  confirmText: PropTypes.string.isRequired,
  canEditType: PropTypes.bool,
};

QuestionnaireSettingsModal.defaultProps = {
  questionnaire: defaultQuestionnaire,
  canEditType: true,
};

QuestionnaireSettingsModal.fragments = {
  QuestionnaireSettingsModal: gql`
    fragment QuestionnaireSettingsModal on Questionnaire {
      ...Questionnaire
    }
    ${QuestionnaireMeta.fragments.Questionnaire}
  `,
};

export default QuestionnaireSettingsModal;
