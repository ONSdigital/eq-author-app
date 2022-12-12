import React from "react";
import { render } from "tests/utils/rtl";

import SelectAnswer from "./SelectAnswer";

import { SELECT } from "constants/answer-types";

describe("Select", () => {
  let props;

  const populateMockOptions = () => {
    const mockOptions = [];

    for (let i = 0; i < 24; i++) {
      mockOptions.push({
        id: `option-${i}`,
        label: `Label ${i}`,
      });
    }

    return mockOptions;
  };

  const renderSelectAnswer = (props) => {
    return render(<SelectAnswer {...props} />);
  };

  beforeEach(() => {
    props = {
      answer: {
        id: "answer-1",
        displayName: "Answer label",
        description: "Answer description",
        type: SELECT,
        options: populateMockOptions(),
      },
    };
  });

  it("should render select component", () => {
    const { getByTestId } = renderSelectAnswer(props);

    expect(getByTestId("preview-select-answer-container")).toBeInTheDocument();
  });

  it("should render select answer label", () => {
    const { getByText } = renderSelectAnswer(props);

    expect(getByText("Answer label")).toBeInTheDocument();
  });

  it("should render select answer description", () => {
    const { getByText } = renderSelectAnswer(props);

    expect(getByText("Answer description")).toBeInTheDocument();
  });

  it("should render all options", () => {
    const { getByTestId } = renderSelectAnswer(props);

    // forEach loop to test all options are rendered
    props.answer.options.forEach((_, index) => {
      expect(
        getByTestId(`preview-select-option-label-${index}`)
      ).toBeInTheDocument();
    });
  });

  it("should render missing option label", () => {
    props.answer.options[0].label = "";
    const { getByTestId } = renderSelectAnswer(props);

    expect(
      getByTestId("preview-select-missing-option-label-0")
    ).toBeInTheDocument();

    expect(getByTestId("preview-select-option-label-1")).toBeInTheDocument();
  });
});
