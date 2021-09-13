import React from "react";
import useModal from "hooks/useModal";
import ConfirmationModal from "components/modals/ConfirmationModal";
import {
  Title,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from "@storybook/addon-docs/blocks";

export const Default = (args) => {
  const [trigger, Modal] = useModal({
    ...args,
    component: ConfirmationModal,
  });

  return (
    <>
      <Modal />
      <button onClick={trigger}>Trigger modal</button>
    </>
  );
};

Default.args = {
  confirmText: "Yes",
  isOpen: true,
};

export default {
  title: "Patterns/Modals/Confirmation",
  component: ConfirmationModal,
  argTypes: {
    onConfirm: { action: "Confirmed" },
    onCancel: { action: "Cancelled" },
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <p>A modal used for simple confirmation of a question or process.</p>
          <ArgsTable story={PRIMARY_STORY} />
          <Primary />
          <Stories />
        </>
      ),
    },
  },
};
