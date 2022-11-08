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

export const ModalWithoutWarning = (props) => {
  const [trigger, Modal] = useModal({
    ...props,
    title: "Delete questionnaire",
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
          <p>Modal without warning</p>
          <ArgsTable story={PRIMARY_STORY} />
          <Primary />
          <Stories />
        </>
      ),
    },
  },
};
