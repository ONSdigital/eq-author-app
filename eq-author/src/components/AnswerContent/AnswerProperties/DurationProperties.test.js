import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import { YEARS } from "constants/duration-types";
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
        type: "Duration",
      },
      page: {
        id: 1,
      },
      updateAnswer: jest.fn(),
      updateAnswerOfType: jest.fn(),
    };
  });

  it("should render", () => {
    const { getByTestId } = renderDurationProperties(props);
    expect(getByTestId("duration-select")).toBeTruthy();
  });

  it("should handle change event for input", () => {
    const { getByTestId } = renderDurationProperties(props);
    const select = getByTestId("duration-select");
    fireEvent.change(select, { target: { unit: YEARS } });
    expect(props.updateAnswerOfType).toHaveBeenCalledTimes(1);
  });
});
