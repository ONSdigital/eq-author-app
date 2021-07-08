import React from "react";

import { render } from "tests/utils/rtl";

import QuestionPicker from ".";
import mockSections from "../../tests/mocks/mockSections.json";

describe("QuestionPicker", () => {
  const defaultProps = {
    title: "Select the question(s) to import",
    isOpen: true,
    showSearch: true,
    warningPanel:
      "You cannot import folders but you can import any questions they contain.",
    onSubmit: (selectedAnswers) => jest.fn(selectedAnswers),
    onClose: jest.fn(),
    startingSelectedQuestions: [],
    sections: mockSections,
  };

  const renderQuestionPicker = (args) =>
    render(<QuestionPicker isOpen {...defaultProps} {...args} />);

  it("Can render", () => {
    const { getByText } = renderQuestionPicker({});

    expect(getByText(defaultProps.title)).toBeInTheDocument();
  });
});
