/* eslint-disable react/no-find-dom-node */
import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import { colors } from "constants/theme";
import ToggleSwitch from "./";

const renderComponent = (props) => {
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

  it("should not render on/off labels by default", () => {
    const { getByText } = renderComponent({
      ...props,
    });
    expect(getByText("Off")).toHaveStyleRule("display", "none");
    expect(getByText("On")).toHaveStyleRule("display", "none");
  });

  it("should render on/off labels when label prop is passed", () => {
    const { getByText } = renderComponent({
      ...props,
      id: "toggle-2",
      hideLabels: false,
    });
    expect(getByText("Off")).toHaveStyleRule("color", colors.black);
    expect(getByText("Off")).toHaveStyleRule("display", "flex");

    expect(getByText("On")).toHaveStyleRule("color", colors.grey);
    expect(getByText("On")).toHaveStyleRule("display", "flex");
  });

  it("should change on/off label colors when prop is passed and checked", () => {
    const { getByText } = renderComponent({
      ...props,
      id: "toggle-2",
      checked: true,
      hideLabels: false,
    });
    expect(getByText("Off")).toHaveStyleRule("color", colors.grey);
    expect(getByText("Off")).toHaveStyleRule("display", "flex");

    expect(getByText("On")).toHaveStyleRule("color", colors.black);
    expect(getByText("On")).toHaveStyleRule("display", "flex");
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
