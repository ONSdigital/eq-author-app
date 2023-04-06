import React from "react";

import { render, fireEvent } from "tests/utils/rtl";

import RepeatingLabelAndInput from "./index";

const renderRepeatingLabelAndInput = () => render(<RepeatingLabelAndInput />);
const handleUpdate = jest.fn();

const answer = {
  id: "2741c657-25f4-4da2-8bb7-5ab4a02e2f71",
  label: "<p>Thoughts</p>",
  type: "TextField",
  questionPageId: "2cb6f93f-4f53-4321-9cc2-ca7f1cbbfa32",
  repeatingLabelAndInput: false,
  repeatingLabelAndInputId: "",
  properties: {
    required: false,
  },
  validation: {},
};

describe("Repeating label and input", () => {
  it("should render component", () => {
    const { getByText } = renderRepeatingLabelAndInput(handleUpdate);
  });
});
