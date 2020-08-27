import React from "react";

import Button from "../components/buttons/Button";

export default {
  title: "Design Systems/Atoms/Button",
  component: Button,
};

const Template = args => <Button {...args}>Button</Button>;

export const Primary = Template.bind({});
Primary.args = {
  variant: "primary",
  type: "Button",
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: "secondary",
  type: "Button",
};

export const Tertiary = Template.bind({});
Tertiary.args = {
  variant: "tertiary",
  type: "Button",
};

export const TertiaryLight = Template.bind({});
TertiaryLight.args = {
  variant: "tertiary-light",
  type: "Button",
};

export const Positive = Template.bind({});
Positive.args = {
  variant: "positive",
  type: "Button",
};

export const Negative = Template.bind({});
Negative.args = {
  variant: "negative",
  type: "Button",
};

export const Navigation = Template.bind({});
Navigation.args = {
  variant: "navigation",
  type: "Button",
};

export const NavigationModal = Template.bind({});
NavigationModal.args = {
  variant: "navigation-modal",
  type: "Button",
};

export const NavigationOn = Template.bind({});
NavigationOn.args = {
  variant: "navigation-on",
  type: "Button",
};

export const Signout = Template.bind({});
Signout.args = {
  variant: "signout",
  type: "Button",
};

export const Greyed = Template.bind({});
Greyed.args = {
  variant: "greyed",
  type: "Button",
};

export const NavHeader = Template.bind({});
NavHeader.args = {
  variant: "nav-header",
  type: "Button",
};

export const NavAddMenu = Template.bind({});
NavAddMenu.args = {
  variant: "nav-addMenu",
  type: "Button",
};

export const Medium = Template.bind({});
Medium.args = {
  medium: true,
};

export const Small = Template.bind({});
Small.args = {
  small: true,
};
