import React from "react";

import { render, fireEvent } from "tests/utils/rtl";
import RepeatingLabelAndInput from "./index";

const handleUpdate = jest.fn();

const answer = {
  id: "2741c657-25f4-4da2-8bb7-5ab4a02e2f71",
  label: "<p>Thoughts</p>",
  type: "TextField",
  questionPageId: "2cb6f93f-4f53-4321-9cc2-ca7f1cbbfa32",
  repeatingLabelAndInput: false,
  repeatingLabelAndInputListId: "list-id",
  properties: {
    required: false,
  },
  validation: {},
  validationErrorInfo: { errors: [] },
};

const renderRepeatingLabelAndInput = (handleUpdate, answer) =>
  render(
    <RepeatingLabelAndInput answer={answer} handleUpdate={handleUpdate} />
  );

describe("Repeating label and input", () => {
  it("should render component", () => {
    const { getByText } = renderRepeatingLabelAndInput(handleUpdate, answer);
    expect(getByText("Repeat label and input")).toBeTruthy();
  });

  it("should toggle on repeat label and input", async () => {
    handleUpdate.mockImplementationOnce(() => {
      answer.repeatingLabelAndInput = !answer.repeatingLabelAndInput;
    });

    const { getByTestId } = renderRepeatingLabelAndInput(handleUpdate, answer);
    const toggle = getByTestId("repeat-label-and-input-toggle-input");

    fireEvent.change(toggle, { target: { value: "On" } });
    fireEvent.click(toggle);

    expect(handleUpdate).toHaveBeenCalled();
  });

  it("should display collection lists", () => {
    answer.repeatingLabelAndInput = true;

    const { getByText } = renderRepeatingLabelAndInput(handleUpdate, answer);
    expect(getByText("Select a collection list")).toBeTruthy();
  });
});
