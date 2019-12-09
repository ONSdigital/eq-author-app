/* eslint-disable react/no-find-dom-node */
import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import { colors } from "constants/theme";
import ToggleSwitch from "./";

const renderComponent = props => {
  return render(<ToggleSwitch {...props} />);
};

describe("ToggleSwitch", () => {
  let handleChange;
  let props;

  beforeEach(() => {
    handleChange = jest.fn();

    props = {
      id: "test",
      label: "Test switch",
      name: "test",
      onChange: handleChange,
      checked: false,
    };
  });

  it("should render", () => {
    expect(renderComponent(props).asFragment()).toMatchSnapshot();
  });

  it("should render checked", () => {
    const { getByRole } = renderComponent({
      ...props,
      id: "toggle-2",
      checked: true,
    });
    expect(getByRole("presentation")).toHaveStyleRule(
      "background",
      colors.blue
    );
  });

  it("should render a large toggle button", () => {
    expect(
      renderComponent({
        ...props,
        id: "toggle-3",
        width: 5,
        height: 2,
        size: 2,
      }).asFragment()
    ).toMatchSnapshot();
  });

  it("should invoke onChange prop when clicked", () => {
    const { getByRole } = renderComponent({
      ...props,
      id: "toggle-2",
      checked: true,
    });
    fireEvent.click(getByRole("checkbox"));
    expect(props.onChange).toHaveBeenCalled();
  });
});
