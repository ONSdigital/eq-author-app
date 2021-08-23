import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import { YEARSMONTHS, YEARS } from "constants/duration-types";

import DurationProperties from "./DurationProperties";

const renderDurationProperties = (props = {}) =>
  render(<DurationProperties {...props} />);

describe("Required Property", () => {
  let props;

  beforeEach(() => {
    props = {
      answer: {
        id: "1",
        properties: {
          required: true,
        },
      },
      unit: YEARSMONTHS,
      onChange: jest.fn(),
    };
  });

  it("should render", () => {
    const { getByTestId } = renderDurationProperties(props);
    expect(getByTestId("collapsible")).toBeTruthy();
  });

  it("should handle change event for input", () => {
    const { getByTestId } = renderDurationProperties(props);
    const select = getByTestId("duration-select");
    fireEvent.change(select, { target: { unit: YEARS } });
    expect(props.onChange).toHaveBeenCalledTimes(1);
  });
});
