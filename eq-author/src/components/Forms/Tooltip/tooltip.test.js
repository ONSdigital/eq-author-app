import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import Tooltip from ".";

describe("Tooltip", () => {
  it("should render arbitrary content", () => {
    const content = (
      <ul>
        <li>foo</li>
        <li>bar</li>
      </ul>
    );

    const { getByText } = render(
      <Tooltip content={content}>
        <button id="buttonTooltip">Click me</button>
      </Tooltip>
    );

    expect(getByText("foo")).toBeTruthy();
  });

  it("should hide onClick", () => {
    jest.useFakeTimers();

    const originalOnClick = jest.fn();
    const ref = React.createRef();
    const { getByText } = render(
      <Tooltip content="Special button" ref={ref}>
        <button onClick={originalOnClick}>Click me</button>
      </Tooltip>
    );
    ref.current.tooltip.hideTooltip = jest.fn();
    fireEvent.click(getByText("Click me"));
    expect(ref.current.tooltip.hideTooltip).toHaveBeenCalled();
  });
});
