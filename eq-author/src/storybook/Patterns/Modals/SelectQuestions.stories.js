import React from "react";
import useModal from "hooks/useModal";

import QuestionPicker from "components/QuestionPicker";
import mockSections from "tests/mocks/mockSections.json";
import {
  Title,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from "@storybook/addon-docs/blocks";
// https://stackoverflow.com/questions/56248544/how-to-show-unordered-list-within-window-alert/56248648
const createUnorderedList = (list, bulletChar) =>
  list.reduce((acc, val) => (acc += `${bulletChar} ${val}\n`), ""); //eslint-disable-line

export const Default = (args) => {
  const [trigger, Modal] = useModal({
    ...args,
    component: QuestionPicker,
  });

  return (
    <>
      <Modal />
      <button onClick={trigger}>Trigger modal</button>
    </>
  );
};

Default.args = {
  title: "Select the question(s) to import",
  isOpen: false,
  showSearch: true,
  warningPanel:
    "You cannot import folders but you can import any questions they contain.",
  onSubmit: (selectedAnswers) =>
    alert(
      "You have selected the following questions:\n\n" +
        createUnorderedList(
          selectedAnswers.map(({ displayName }) => displayName),
          "•"
        )
    ),
  startingSelectedQuestions: [],
  sections: mockSections,
};

export default {
  title: "Patterns/Modals/Select questions",
  component: QuestionPicker,
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
