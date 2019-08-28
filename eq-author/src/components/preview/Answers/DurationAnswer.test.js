import React from "react";

import { render } from "tests/utils/rtl";

import { YEARSMONTHS, YEARS, MONTHS } from "constants/duration-types";

import DurationAnswer from "./DurationAnswer";

describe("Duration Answer", () => {
  it("should render Years", () => {
    const answer = {
      label: "Label",
      description: "Description",
      properties: {
        unit: YEARS,
      },
    };

    const { queryByText } = render(<DurationAnswer answer={answer} />);

    expect(queryByText("Years")).toBeTruthy();
    expect(queryByText("Months")).toBeFalsy();
  });

  it("should render Months", () => {
    const answer = {
      label: "Label",
      description: "Description",
      properties: {
        unit: MONTHS,
      },
    };

    const { queryByText } = render(<DurationAnswer answer={answer} />);

    expect(queryByText("Years")).toBeFalsy();
    expect(queryByText("Months")).toBeTruthy();
  });

  it("should render Years & MOnths", () => {
    const answer = {
      label: "Label",
      description: "Description",
      properties: {
        unit: YEARSMONTHS,
      },
    };

    const { queryByText } = render(<DurationAnswer answer={answer} />);

    expect(queryByText("Years")).toBeTruthy();
    expect(queryByText("Months")).toBeTruthy();
  });
});
