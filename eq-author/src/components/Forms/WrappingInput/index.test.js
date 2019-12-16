import React from "react";
import { render, fireEvent, createEvent } from "tests/utils/rtl";
import WrappingInput from ".";

describe("WrappingInput", () => {
  let handleChange, handleUpdate;

  beforeEach(() => {
    handleChange = jest.fn();
    handleUpdate = jest.fn();
  });
  it("should render", () => {
    const { getByText } = render(
      <WrappingInput
        id="foo"
        value="123"
        onChange={handleChange}
        onBlur={handleUpdate}
        data-test="wrapping-input-textarea"
      />
    );
    expect(getByText("123")).toBeTruthy();
  });

  it("will prevent new lines being inserted", () => {
    const ENTER_KEY = 13;
    const preventDefault = jest.fn();

    const { getByTestId } = render(
      <WrappingInput
        id="foo"
        value="123"
        onChange={handleChange}
        onBlur={handleUpdate}
        data-test="wrapping-input-textarea"
      />
    );

    const keyboardEvent = createEvent.keyDown(
      getByTestId("wrapping-input-textarea"),
      {
        keyCode: ENTER_KEY,
      }
    );
    keyboardEvent.preventDefault = preventDefault;
    fireEvent(getByTestId("wrapping-input-textarea"), keyboardEvent);

    expect(preventDefault).toHaveBeenCalled();
  });
});
