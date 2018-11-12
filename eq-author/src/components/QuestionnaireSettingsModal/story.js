import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import QuestionnaireSettingsModal from "components/QuestionnaireSettingsModal";

storiesOf("QuestionnaireSettingsModal", module).add("Default", () => (
  <QuestionnaireSettingsModal
    questionnaire={{
      id: "1",
      title: "Lorem ipsum dolor sit, amet consectetur adipisicing elit",
      navigation: true
    }}
    isOpen
    onSubmit={action("submit")}
    onClose={action("close")}
    confirmText="Create"
  />
));
