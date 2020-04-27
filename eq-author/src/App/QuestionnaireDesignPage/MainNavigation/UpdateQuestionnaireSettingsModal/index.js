import React from "react";
import PropTypes from "prop-types";

import QuestionnaireSettingsModal from "App/QuestionnaireSettingsModal";
import pipeP from "utils/pipeP";

import withUpdateQuestionnaire from "./withUpdateQuestionnaire";

const UpdateQuestionnaireSettingsModal = ({
  onClose,
  onUpdateQuestionnaire,
  ...otherProps
}) => (
  <QuestionnaireSettingsModal
    onSubmit={pipeP(onUpdateQuestionnaire, onClose)}
    confirmText="Apply"
    canEditType={false}
    onClose={onClose}
    {...otherProps}
  />
);
UpdateQuestionnaireSettingsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onUpdateQuestionnaire: PropTypes.func.isRequired,
};

export default withUpdateQuestionnaire(UpdateQuestionnaireSettingsModal);
