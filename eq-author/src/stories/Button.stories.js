import React from 'react';

import Button from '../components/buttons/Button';

export default {
  title: 'Example/Button',
  component: Button,
};

const Template = (args) => <Button {...args}>Button</Button>;

export const Primary = Template.bind({});
Primary.args = {
  variant: "primary",
  type: 'Button',
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: "secondary",
  type: 'Button',
};

export const Tertiary = Template.bind({});
Tertiary.args = {
  variant: "tertiary",
  type: 'Button',
};

export const TertiaryLight = Template.bind({});
TertiaryLight.args = {
  variant: "tertiary-light",
  type: 'Button',
};

export const Positive = Template.bind({});
Positive.args = {
  variant: "positive",
  type: 'Button',
};

export const Negative = Template.bind({});
Negative.args = {
  variant: "negative",
  type: 'Button',
};
