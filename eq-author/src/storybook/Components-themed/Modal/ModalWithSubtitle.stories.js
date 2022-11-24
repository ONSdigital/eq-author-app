import React from "react";
import ModalComponent from "components-themed/Modal";
import {
  Title,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from "@storybook/addon-docs/blocks";

import useModal from "hooks/useModal";

export const ModalWithSubtitle = (props) => {
  const [trigger, Modal] = useModal({
    ...props,
    title: "Delete questionnaire",
    subtitle: "Questionnaire name",
    warningMessage: "All questionnaire contents will be deleted",
    positiveButtonText: "Delete",
    component: ModalComponent,
  });

  return (
    <>
      <Modal {...props} />
      <button onClick={trigger}>Display modal</button>
    </>
  );
};

export default {
  title: "Themed components/ONS/Modal",
  component: ModalComponent,
  argTypes: {
    onConfirm: { action: "Confirmed" },
    onCancel: { action: "Cancelled" },
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <p>Modal with subtitle</p>
          <ArgsTable story={PRIMARY_STORY} />
          <Primary />
          <Stories />
        </>
      ),
    },
  },
};
