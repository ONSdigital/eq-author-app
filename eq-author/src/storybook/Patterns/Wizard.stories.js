import React, { useEffect } from "react";
import useModal from "hooks/useModal";
import Wizard, {
  Header,
  Heading,
  Subheading,
  Content,
  Warning,
} from "components/modals/Wizard";

import {
  Title,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from "@storybook/addon-docs/blocks";

const Template = (args) => {
  const [trigger, Modal] = useModal({
    ...args,
    component: Wizard,
  });

  return (
    <>
      <Modal />
      <button onClick={trigger}>Trigger modal</button>
    </>
  );
};

export const WizardModal = Template.bind({});
WizardModal.args = {
  confirmText: "Onward!",
  isOpen: true,
  children: (
    <>
      <Header>
        <Heading>
          A title suitable for a true wizard{" "}
          <span role="img" aria-label="wizard">
            🧙🏻‍♂️
          </span>
        </Heading>
        <Subheading>
          <Warning>
            Disclaimer: The School of Wizardry provides this tool for use
            STRICTLY at your own risk.
          </Warning>
        </Subheading>
      </Header>
      <Content>
        <h4>Choose the priming ingredient mix: </h4>
        <label>
          <input type="checkbox" />
          Mitochondrion of Newt
        </label>
        <br />
        <label>
          <input type="checkbox" />
          Golgi complex of Gargoyle
        </label>
        <br />
        <label>
          <input type="checkbox" />
          Vacuole of Violet
        </label>
      </Content>
    </>
  ),
};

export default {
  title: "Patterns/Wizard Modal",
  component: Wizard,
  args: {
    isOpen: true,
  },
  argTypes: {
    isOpen: {
      description: "If the wizard modal is currently visable",
      table: { type: { summary: "Bool" } },
    },
    confirmText: {
      description: "Text to display on the 'confirmation' button",
      table: { type: { summary: "String" } },
    },
    cancelText: {
      description: "Text to display on the 'cancel' button",
      table: { type: { summary: "String" } },
    },
    onConfirm: {
      description: "Callback invoked when 'confirm' button pressed",
      action: "confirm",
      table: { type: { summary: "Function" } },
    },
    onCancel: {
      description: "Callback invoked when 'cancel' button pressed",
      action: "cancel",
      table: { type: { summary: "Function" } },
    },
    onBack: {
      description: "Callback invoked when 'back' button pressed",
      action: "back",
      table: { type: { summary: "Function" } },
    },
    children: {
      description: "React components to render inside the modal",
      table: { type: { summary: "Node" } },
    },
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <p>
            A modal component with <code>Back</code>, <code>Confirm</code> and{" "}
            <code>Cancel</code> buttons.
          </p>
          <ArgsTable story={PRIMARY_STORY} />
          <Primary />
          <Stories />
        </>
      ),
    },
  },
};
