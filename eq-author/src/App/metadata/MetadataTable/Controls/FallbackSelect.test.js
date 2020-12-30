import React from "react";
import { render, screen } from "tests/utils/rtl";
import userEvent from "@testing-library/user-event";

import { FallbackSelect } from "./FallbackSelect";

describe("FallbackSelect", () => {
  it("should correctly pass on selected value", async () => {
    const onChange = jest.fn();
    const onUpdate = jest.fn();
    const name = "fallbackKey";

    render(
      <FallbackSelect
        options={["The Good", "The Bad", "The Ugly"]}
        placeholder="Pick one..."
        name={name}
        onChange={onChange}
        onUpdate={onUpdate}
        defaultValue={null}
      />
    );

    const input = screen.getByRole("combobox");

    input.focus();
    userEvent.type(input, "{arrowdown}");
    userEvent.type(input, "{enter}");
    input.blur();

    expect(onChange).toHaveBeenCalled();
  });
});
