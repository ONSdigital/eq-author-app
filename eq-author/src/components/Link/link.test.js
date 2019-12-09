import React from "react";
import { render } from "tests/utils/rtl";
import Link from "./";

describe("Link", () => {
  it("should render", () => {
    expect(render(<Link href={"#"} />).asFragment()).toMatchSnapshot();
  });
});
