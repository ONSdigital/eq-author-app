import React from "react";
import ItemSelectModal from "components/ItemSelectModal";
import ItemSelect, { Option } from "components/ItemSelectModal/ItemSelect";
import styled from "styled-components";

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

const Default = (args) => {
  return (
    <ItemSelectModal isOpen {...args}>
      <ItemSelect data-test="testOne" name={args.title.toLowerCase()} value="1">
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
    </ItemSelectModal>
  );
};

export const Modal = Default.bind({});
Modal.args = {
  title: "Move Question",
};

export default {
  title: "Patterns/Modals/ItemSelectModal",
  component: ItemSelectModal,
  argTypes: {
    onConfirm: { action: "Confirmed" },
    onCancel: { action: "Cancelled" },
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
    children: {
      defaultValue: "Section One",
    },
  },
};
