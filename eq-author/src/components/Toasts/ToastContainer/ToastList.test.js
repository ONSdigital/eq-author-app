import React from "react";
import { render } from "tests/utils/rtl";
import ToastList from "./ToastList";
import Transition from "./Transition";

describe("ToastList", () => {
  const renderToast = (props = {}) =>
    render(
      <ToastList {...props}>
        <p>hello</p>
        <p>world</p>
      </ToastList>
    );

  it("should render", () => {
    const { getByText } = renderToast();
    expect(getByText("hello")).toBeTruthy();
    expect(getByText("world")).toBeTruthy();
  });

  it("should allow configurable Transitions", () => {
    const { getAllByTestId } = renderToast({ transition: Transition });
    expect(getAllByTestId("toast-item")).toMatchSnapshot();
  });
});
