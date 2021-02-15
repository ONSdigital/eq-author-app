import React from "react";

import ButtonGroup from "../../components/buttons/ButtonGroup";
import Button from "../../components/buttons/Button";

export default {
  title: "Patterns/Button Group",
  component: ButtonGroup,
};

const button = (label = "Button") => <Button>{label}</Button>;

const Template = (args) => <ButtonGroup {...args} />;

export const Horizontal = Template.bind({});
Horizontal.args = {
  horizontal: true,
  children: [button("First"), button("Second")],
};

export const Vertical = Template.bind({});
Vertical.args = {
  vertical: true,
  children: [button("First"), button("Second")],
};

export const AlignRight = Template.bind({});
AlignRight.args = {
  horizontal: true,
  align: "right",
  children: [button("First"), button("Second")],
};
