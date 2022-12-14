import React from "react";
import PropTypes from "prop-types";

import QuestionnaireSettingsModal from "App/QuestionnaireSettingsModal";
import pipeP from "utils/pipeP";

import withUpdateQuestionnaire from "./withUpdateQuestionnaire";

import Theme from "contexts/themeContext";

const UpdateQuestionnaireSettingsModal = ({
  onClose,
  onUpdateQuestionnaire,
  ...otherProps
}) => (
  <Theme themeName={"onsLegacyFont"}>
    <QuestionnaireSettingsModal
      onSubmit={pipeP(onUpdateQuestionnaire, onClose)}
      confirmText="Create duplicate"
      canEditType={false}
      onClose={onClose}
      title="Duplicate questionnaire"
      {...otherProps}
    />
  </Theme>
);
UpdateQuestionnaireSettingsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onUpdateQuestionnaire: PropTypes.func.isRequired,
};

export default withUpdateQuestionnaire(UpdateQuestionnaireSettingsModal);
