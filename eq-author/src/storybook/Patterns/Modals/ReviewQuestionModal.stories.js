import React from "react";
import ImportQuestionReviewModal from "components/modals/ImportQuestionReviewModal";
import useModal from "hooks/useModal";

import {
  Title,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from "@storybook/addon-docs/blocks";

const dummyQuestions = [
  { alias: "Q1", title: "How many roads must a man walk down?" },
  { alias: "Q2", title: "What is the airspeed velocity of a swallow?" },
  { alias: "Q3", title: "What is your favorite colour?" },
];

const Template = (args) => {
  const [trigger, Modal] = useModal({
    ...args,
    component: ImportQuestionReviewModal,
  });

  return (
    <>
      <Modal />
      <button onClick={trigger}>Trigger modal</button>
    </>
  );
};

export const Modal = Template.bind({});
Modal.args = {
  questionnaire: {
    title: "Important Questions",
  },
  onSelectQuestions: (_questionnaire, callback) => callback(dummyQuestions),
  startingSelectedQuestions: dummyQuestions,
};

export default {
  title: "Patterns/Modals/Review questions",
  component: Modal,
  args: {
    isOpen: true,
  },
  argTypes: {
    isOpen: {
      description: "If the wizard modal is currently visible",
      table: { type: { summary: "Bool" } },
    },
    questionnaire: {
      description: "Source questionnaire object",
      table: { type: { summary: "Object" } },
    },
    onConfirm: {
      description:
        "Callback called with selected questions array when user confirms by pressing 'Import'",
      action: "Confirmed",
      table: { type: { summary: "Function" } },
    },
    onCancel: {
      description: "Callback invoked when users press the 'Cancel' button",
      action: "Cancelled",
      table: { type: { summary: "Function" } },
    },
    onBack: {
      description: "Callback invoked when users press the 'Back' button",
      action: "Back",
      table: { type: { summary: "Function" } },
    },
    onSelectQuestions: {
      description:
        "Callback invoked when users press the 'Select questions' button. Called with `questionnaire`, `callback`. Expects `callback` to be called with an array of selected questions.",
      action: "Back",
      table: { type: { summary: "Function" } },
    },
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <p>
            A modal used for reviewing questions to import during the content
            importing process.
          </p>
          <ArgsTable story={PRIMARY_STORY} />
          <Primary />
          <Stories />
        </>
      ),
    },
  },
};
