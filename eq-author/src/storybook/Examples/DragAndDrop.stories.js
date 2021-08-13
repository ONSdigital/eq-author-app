import React from "react";

import {
  Title,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from "@storybook/addon-docs/blocks";

import DragAndDrop from "components/DragAndDrop";

export default {
  title: "Examples/Drag and drop",
  component: DragAndDrop,
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <p>
            This is a prototype, created by EAR-1344, aimed to demonstrate how a
            drag and drop menu might look in Author. It was created using the{" "}
            <a href="https://github.com/atlassian/react-beautiful-dnd">
              React Beautiful DND
            </a>{" "}
            library.
          </p>
          <p>
            The prototype was built using the same components that comprise the
            existing navigaion bar.
          </p>
          <h3>Accessibility features</h3>
          <p>
            The library comes with out-of-the-box accessibility support,
            including full keyboard support and configurable screen reader
            support.
          </p>
          <p>
            The cursor also changes to supply feedback to the user on what can
            be done. For instance, a flat hand when hovering over a draggable
            element, a clenched fist when dragging an element, and a pointed
            finger at a non-draggable link.
          </p>
          <p>To use the keyboard support:</p>
          <ol>
            <li>
              Tab through the page to focus on the right arrow symbol beside the
              section title
            </li>
            <li>Press enter right arrow key - the collapsible will open</li>
            <li>Carry on tabbing through and focus on a page</li>
            <li>Press the space bar - this will select a page to grab</li>
            <li>Using the arrow keys, move the page up and down</li>
            <li>
              Press the space bar again - this will drop the page into the new
              position
            </li>
          </ol>
          <Primary />
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
};

const Template = (args) => <DragAndDrop {...args} />;

export const OneSection = Template.bind({});
OneSection.args = {
  sections: [
    {
      id: "section-1",
      title: "Animation movies",
      pages: [
        { id: "page-1", title: "Toy Story" },
        { id: "page-2", title: "Shrek" },
        { id: "page-3", title: "Finding Nemo" },
        { id: "page-4", title: "Finding Dory" },
      ],
    },
  ],
};
