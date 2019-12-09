import React from "react";
import { render } from "tests/utils/rtl";

import UnitInput, { Type } from "./UnitInput";

describe("UnitInput", () => {
  it("should render with a unit", () => {
    const { getByText } = render(<UnitInput unit="£" />);
    expect(getByText("£")).toBeTruthy();
  });

  it("should render as trailing when necessary", () => {
    const { getByTestId } = render(<UnitInput unit="%" trailing />);
    expect(getByTestId("unit-type")).toHaveStyleRule("right", "0");
  });
});

describe("Type", () => {
  it("should be positioned at the start with left border radius", () => {
    const { getByTestId } = render(<Type />);
    expect(getByTestId("unit-type")).toHaveStyleRule("left", "0");
    expect(getByTestId("unit-type")).toHaveStyleRule(
      "border-radius",
      "3px 0 0 3px"
    );
  });

  it("should be positioned at the start with right border radius", () => {
    const { getByTestId } = render(<Type trailing />);
    expect(getByTestId("unit-type")).toHaveStyleRule("right", "0");
    expect(getByTestId("unit-type")).toHaveStyleRule(
      "border-radius",
      "0 3px 3px 0"
    );
  });
});
