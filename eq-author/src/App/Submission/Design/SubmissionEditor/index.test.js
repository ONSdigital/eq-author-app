import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import { useMutation } from "@apollo/react-hooks";
import Theme from "contexts/themeContext";

import SubmissionEditor from ".";

jest.mock("@apollo/react-hooks", () => ({
  useMutation: jest.fn(() => [() => null]),
}));

const questionnaire = {
  id: "questionnaire-1",
  submission: {
    id: "submission-1",
    furtherContent: "<p>Test</p>",
    viewPrintAnswers: true,
    emailConfirmation: true,
    feedback: true,
  },
};

const { submission } = questionnaire;

const renderSubmissionEditor = () => {
  return render(
    <Theme>
      <SubmissionEditor submission={submission} />
    </Theme>
  );
};

//eslint-disable-next-line react/prop-types
jest.mock("components/RichTextEditor", () => ({ onUpdate }) => {
  const handleInputChange = (event) =>
    onUpdate({
      value: event.target.value,
    });
  return (
    <input
      data-test="further-content-text-editor"
      onChange={handleInputChange}
    />
  );
});

describe("Submission Editor", () => {
  it("should render", () => {
    const { getByTestId } = renderSubmissionEditor();
    expect(getByTestId("submission-editor")).toBeVisible();
  });

  it("should update furtherContent when content is edited in rich text editor", () => {
    const updateSubmission = jest.fn();
    useMutation.mockImplementation(jest.fn(() => [updateSubmission]));

    const { getByTestId } = renderSubmissionEditor();

    const furtherContentTextEditor = getByTestId("further-content-text-editor");

    fireEvent.change(furtherContentTextEditor, {
      target: { value: "Further content" },
    });

    expect(updateSubmission).toHaveBeenCalledWith({
      variables: { input: { furtherContent: "Further content" } },
    });
  });

  it("should update viewPrintAnswers when toggle switch is clicked", () => {
    const updateSubmission = jest.fn();
    useMutation.mockImplementation(jest.fn(() => [updateSubmission]));

    const { getByTestId } = renderSubmissionEditor();

    fireEvent.click(getByTestId("viewPrintAnswers-input"));

    expect(updateSubmission).toHaveBeenCalledWith({
      variables: { input: { viewPrintAnswers: false } },
    });
  });

  it("should update emailConfirmation when toggle switch is clicked", () => {
    const updateSubmission = jest.fn();
    useMutation.mockImplementation(jest.fn(() => [updateSubmission]));

    const { getByTestId } = renderSubmissionEditor();

    fireEvent.click(getByTestId("emailConfirmation-input"));

    expect(updateSubmission).toHaveBeenCalledWith({
      variables: { input: { emailConfirmation: false } },
    });
  });

  it("should update feedback when toggle switch is clicked", () => {
    const updateSubmission = jest.fn();
    useMutation.mockImplementation(jest.fn(() => [updateSubmission]));

    const { getByTestId } = renderSubmissionEditor();

    fireEvent.click(getByTestId("feedback-input"));

    expect(updateSubmission).toHaveBeenCalledWith({
      variables: { input: { feedback: false } },
    });
  });
});
