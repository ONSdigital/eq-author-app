import React from "react";

import { render, fireEvent } from "tests/utils/rtl";
import DeleteButton from "./";

describe("DeleteButton", () => {
  const renderButton = ({ size }) =>
    render(<DeleteButton size={size} />).asFragment();

  it("should render", () => {
    expect(renderButton(<DeleteButton size="small" />)).toMatchSnapshot(
      "small"
    );
    expect(renderButton(<DeleteButton size="medium" />)).toMatchSnapshot(
      "medium"
    );
    expect(renderButton(<DeleteButton size="large" />)).toMatchSnapshot(
      "large"
    );
  });

  it("should invoke callback when clicked", () => {
    const onClickCallback = jest.fn();
    const { getByRole } = render(<DeleteButton onClick={onClickCallback} />);

    fireEvent.click(getByRole("button"));

    expect(onClickCallback).toHaveBeenCalled();
  });
});
