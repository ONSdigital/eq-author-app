import React from "react";
import { render } from "tests/utils/rtl";
import ScrollPane from ".";

describe("ScrollPane", () => {
  it("should render", () => {
    expect(
      render(<ScrollPane>Children</ScrollPane>).asFragment()
    ).toMatchSnapshot();
  });
});
