import React from "react";

import ScrollPane from "../../components/ScrollPane";

export default {
  title: "Patterns/Scroll Pane",
  component: ScrollPane,
  decorators: [
    Story => (
      <div style={{ height: "200px", width: "300px" }}>
        <Story />
      </div>
    ),
  ],
};

const exampleText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const innerText = (label = exampleText) => (
  <textarea style={{ resize: "both" }}>{label}</textarea>
);

const Template = args => <ScrollPane {...args} />;

export const PermamentScroll = Template.bind({});
PermamentScroll.args = {
  permanentScrollBar: true,
  children: [innerText()],
};

export const NotPermamentScroll = Template.bind({});
NotPermamentScroll.args = {
  permanentScrollBar: false,
  children: [innerText()],
};
