import React from "react";
import ConfirmationModal from "components/modals/ConfirmationModal";

export default {
  title: "Patterns/Modals/Confirmation",
  component: ConfirmationModal,
  argTypes: {
    onConfirm: { action: "Confirmed" },
    onCancel: { action: "Cancelled" },
  },
};

export const Default = (args) => <ConfirmationModal isOpen {...args} />;
