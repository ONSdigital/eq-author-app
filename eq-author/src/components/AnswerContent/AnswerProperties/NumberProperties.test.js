import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import NumberProperties from "./NumberProperties";

const renderNumberProperties = (props = {}) =>
  render(<NumberProperties {...props} />);

describe("Required Property", () => {
  let props;

  beforeEach(() => {
    props = {
      answer: {
        id: "1",
        type: "number",
        properties: {
          decimals: 0,
        },
        validationErrorInfo: {
          totalCount: 0,
          errors: [],
          id: "1",
        },
      },
      page: {
        id: 1,
      },
      updateAnswer: jest.fn(),
      updateAnswerOfType: jest.fn(),
    };
  });

  it("should render", () => {
    const { getByTestId } = renderNumberProperties(props);
    expect(getByTestId("number-input")).toBeInTheDocument();
  });

  it("should handle change event for input", () => {
    const { getByTestId } = renderNumberProperties(props);
    const decimalInput = getByTestId("number-input");

    fireEvent.change(decimalInput, {
      target: { value: 1 },
    });

    expect(decimalInput).toHaveValue(1);
  });
});
