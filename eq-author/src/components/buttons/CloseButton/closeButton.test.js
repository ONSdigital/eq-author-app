import React from "react";

import { render, fireEvent } from "tests/utils/rtl";
import CloseButton from ".";

describe("Close button", () => {
  const renderButton = ({ size }) =>
    render(<CloseButton size={size} />).asFragment();

  it("should render", () => {
    expect(renderButton(<CloseButton size="small" />)).toMatchSnapshot("small");
    expect(renderButton(<CloseButton size="medium" />)).toMatchSnapshot(
      "medium"
    );
    expect(renderButton(<CloseButton size="large" />)).toMatchSnapshot("large");
  });

  it("should invoke callback when clicked", () => {
    const onClickCallback = jest.fn();
    const { getByRole } = render(<CloseButton onClick={onClickCallback} />);

    fireEvent.click(getByRole("button"));

    expect(onClickCallback).toHaveBeenCalled();
  });
});
