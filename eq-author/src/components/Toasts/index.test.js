import React from "react";
import { render, fireEvent, act } from "tests/utils/rtl";

import { withShowToast } from "./";

const WrappedComponent = withShowToast(({ showToast }) => {
  return (
    <button onClick={() => showToast("here is my message")}>Button</button>
  );
});

describe("Toasts", () => {
  afterEach(() => {
    act(() => {
      jest.runAllTimers();
    });
  });
  jest.useFakeTimers();

  it("should show a toast", () => {
    const { getByText, queryByText } = render(<WrappedComponent />);
    expect(queryByText("here is my message")).toBeFalsy();
    fireEvent.click(getByText("Button"));
    expect(getByText("here is my message")).toBeTruthy();
  });

  it("should hide the toast after 5 seconds", () => {
    const { getByText, queryByText } = render(<WrappedComponent />);
    expect(queryByText("here is my message")).toBeFalsy();

    fireEvent.click(getByText("Button"));
    act(() => {
      jest.runTimersToTime(5000);
    });
    expect(getByText("here is my message")).toBeTruthy();
    act(() => {
      jest.runTimersToTime(5001);
    });
    expect(queryByText("here is my message")).toBeFalsy();
  });
});
