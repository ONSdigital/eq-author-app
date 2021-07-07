import React, { useState } from "react";

import QuestionPicker from "components/ContentPickerv2/QuestionPickerV2/";

import mockSections from "./mockSections.json";

export default {
  title: "Patterns/Importing content/Select questions",
  component: QuestionPicker,
};

// https://stackoverflow.com/questions/56248544/how-to-show-unordered-list-within-window-alert/56248648
function createUnorderedList(list, bulletChar) {
  var result = "";
  for (var i = 0; i < list.length; ++i) {
    result += bulletChar + " " + list[i] + "\n";
  }
  return result;
}

const Template = ({ isOpen, onClose, ...rest }) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);

  return (
    <>
      <button onClick={() => setModalIsOpen(true)}>Open modal</button>
      <QuestionPicker
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        warningPanel="You cannot import folders but you can import any questions they contain."
        {...rest}
      />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  title: "Select the question(s) to import",
  isOpen: false,
  showSearch: true,
  hideQuestionType: true,
  onSubmit: (selectedAnswers) =>
    alert(
      "You have selected the following questions:\n\n" +
        createUnorderedList(
          selectedAnswers.map(({ displayName }) => displayName),
          "•"
        )
    ),
  startingSelectedAnswers: [],
  sections: mockSections,
};
