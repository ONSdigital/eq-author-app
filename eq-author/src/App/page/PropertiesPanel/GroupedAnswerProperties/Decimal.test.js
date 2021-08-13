import React from "react";
import { render, fireEvent, flushPromises } from "tests/utils/rtl";

import { colors } from "constants/theme";
import Decimal from "./Decimal";

describe("Decimal Property", () => {
  let props;

  beforeEach(() => {
    props = {
      id: "1",
      value: 2,
      hasDecimalInconsistency: false,
      onBlur: jest.fn(),
    };
  });

  it("should render without error", () => {
    const { getByTestId } = render(<Decimal {...props} />);
    expect(getByTestId("number-input")).toBeTruthy();
  });

  it("should render with Error", () => {
    props.hasDecimalInconsistency = true;
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
    expect(props.onBlur).toHaveBeenCalledWith(2);
  });
});
