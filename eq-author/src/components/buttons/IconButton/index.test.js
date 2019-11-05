import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import IconButton from ".";
import Icon from "App/history/icon-close.svg?inline";

describe("IconButton", () => {
  it("should render", () => {
    render(<IconButton icon={Icon} onClick={jest.fn()} />);
  });

  it("should execute onClick function when clicked", () => {
    const testFunction = jest.fn();
    const { getByTestId } = render(
      <IconButton icon={Icon} onClick={testFunction} data-test="test" />
    );
    const button = getByTestId("test");
    fireEvent.click(button);
    expect(testFunction).toHaveBeenCalled();
  });
});
