import React from "react";
import { render } from "tests/utils/rtl";
import VisuallyHidden from "./";

describe("VisuallyHidden", () => {
  it("should render", () => {
    const { asFragment } = render(
      <VisuallyHidden>I am some hidden text</VisuallyHidden>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
