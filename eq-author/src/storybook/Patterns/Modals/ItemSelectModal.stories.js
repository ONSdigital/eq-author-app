import React from "react";
import useModal from "hooks/useModal";
import ItemSelectModal from "components/ItemSelectModal";
import ItemSelect, { Option } from "components/ItemSelectModal/ItemSelect";
import styled from "styled-components";
import {
  Title,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from "@storybook/addon-docs/blocks";

const Indent = styled(Option)`
  margin-left: 1em;
`;

const orderedOptions = [
  {
    displayName: "Test One",
  },
  {
    displayName: "Test Two",
  },
  {
    displayName: "Test Three",
  },
  {
    displayName: "Test Four",
  },
];

export const Default = (args) => {
  const [trigger, Modal] = useModal({
    ...args,
    component: ItemSelectModal,
  });

  return (
    <>
      <Modal />
      <button onClick={trigger}>Trigger modal</button>
    </>
  );
};

// export const Modal = Default.bind({});
Default.args = {
  title: "Move Question",
  isOpen: true,
  children: (
    <>
      <ItemSelect
        data-test="testOne"
        name={"Move Question".toLowerCase()}
        value="1"
      >
        {orderedOptions.map(({ displayName, parentEnabled }, i) => (
          <Indent
            data-test="options"
            key={i}
            value={String(i)}
            indent={parentEnabled ? parentEnabled.toString() : undefined}
          >
            {displayName}
          </Indent>
        ))}
      </ItemSelect>
    </>
  ),
};

export default {
  title: "Patterns/Modals/ItemSelectModal",
  component: ItemSelectModal,
  args: {
    isOpen: true,
  },
  argTypes: {
    onConfirm: { action: "Confirmed" },
    onCancel: {
      description: "Callback invoked when 'cancel' button pressed",
      action: "cancel",
      table: { type: { summary: "Function" } },
    },
    primaryText: {
      description: "The string for the confirm text.",
      defaultValue: "Select",
    },
    secondaryText: {
      description: "The string for the cancel text.",
      defaultValue: "Cancel",
    },
    title: {
      description: "The string for the title text.",
      defaultValue: "Item Select Modal",
    },
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <p>
            A modal containing an ItemSelect component. includes{" "}
            <code>Back</code>, <code>Confirm</code> and <code>Cancel</code>{" "}
            buttons.
          </p>
          <ArgsTable story={PRIMARY_STORY} />
          <Primary />
          <Stories />
        </>
      ),
    },
  },
};
