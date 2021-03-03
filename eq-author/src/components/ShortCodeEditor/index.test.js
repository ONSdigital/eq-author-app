import React from "react";

import { render, fireEvent } from "tests/utils/rtl";

import ShortCodeEditor from ".";

const renderShortCodeEditor = ({
  shortCode = "",
  onUpdate = jest.fn(),
  ...rest
}) =>
  render(
    <ShortCodeEditor shortCode={shortCode} onUpdate={onUpdate} {...rest} />
  );

describe("Short code editor", () => {
  it("Can render", () => {
    const { getByTestId } = renderShortCodeEditor({});

    expect(getByTestId("shortCode")).toBeTruthy();
  });

  it("Initialises with a short code if there is one", () => {
    const { getByTestId } = renderShortCodeEditor({ shortCode: "Glenn" });

    expect(getByTestId("shortCode").value).toBe("Glenn");
  });

  it("Calls the onUpdate function on blur", () => {
    const onUpdate = jest.fn();

    const { getByTestId } = renderShortCodeEditor({ onUpdate });

    const input = getByTestId("shortCode");

    fireEvent.change(input, { target: { value: "Glenn" } });

    fireEvent.blur(input);

    expect(onUpdate).toHaveBeenCalled();
  });
});
