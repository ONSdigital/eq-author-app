import React from "react";
import { render, fireEvent, flushPromises } from "tests/utils/rtl";

import { colors } from "constants/theme";
import Decimal from ".";

describe("Decimal Property", () => {
  let props;

  beforeEach(() => {
    props = {
      answer: {
        id: "1",
        validationErrorInfo: { errors: [] },
      },
      page: { id: "1" },
      value: 2,
      updateAnswerOfType: jest.fn(),
    };
  });

  it("should render without error", () => {
    const { getByTestId } = render(<Decimal {...props} />);
    expect(getByTestId("number-input")).toBeTruthy();
  });

  it("should render with Error", () => {
    props.answer.validationErrorInfo.errors[0] = {
      errorCode: "ERR_REFERENCED_ANSWER_DECIMAL_INCONSISTENCY",
      field: "decimals",
    };
    const { getByTestId } = render(<Decimal {...props} />);
    expect(getByTestId("number-input")).toHaveStyle(`
      border-color: ${colors.errorPrimary};
    `);
  });

  it("should call onChange and onBlur correctly", async () => {
    const { getByTestId } = render(<Decimal {...props} />);
    fireEvent.change(getByTestId("number-input"), {
      target: { value: "2" },
    });
    fireEvent.blur(getByTestId("number-input"));
    await flushPromises();
    expect(props.updateAnswerOfType).toHaveBeenCalledWith({
      variables: {
        input: {
          properties: { decimals: 2 },
          questionPageId: "1",
          type: undefined,
        },
      },
    });
  });
});
