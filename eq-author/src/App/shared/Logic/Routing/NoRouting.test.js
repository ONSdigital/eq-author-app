import React from "react";
import NoRouting from "./NoRouting";
import { render, fireEvent, screen } from "tests/utils/rtl";

describe("components/NoRouting", () => {
  const onAddRouting = jest.fn();

  it("should render with button disabled", () => {
    render(<NoRouting disabled onAddRouting={onAddRouting} />);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should render with button enabled", () => {
    render(<NoRouting onAddRouting={onAddRouting} />);

    expect(screen.getByRole("button")).toBeEnabled();
  });

  it("should call onAddRouting when button clicked", () => {
    render(<NoRouting onAddRouting={onAddRouting} />);

    fireEvent.click(screen.getByRole("button"));
    expect(onAddRouting).toHaveBeenCalledTimes(1);
  });
});
