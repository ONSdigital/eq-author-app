import React, { useState } from "react";
import PropTypes from "prop-types";

import QuestionPicker from "components/QuestionPicker";

import mockSections from "../../../tests/mocks/mockSections.json";

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

const Template = ({ isOpen, ...rest }) => {
  const [modalIsOpen, setModalIsOpen] = useState(isOpen);

  return (
    <>
      <button onClick={() => setModalIsOpen(true)}>Open modal</button>
      <QuestionPicker
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        {...rest}
      />
    </>
  );
};
Template.propTypes = {
  isOpen: PropTypes.bool,
};

export const Default = Template.bind({});
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
