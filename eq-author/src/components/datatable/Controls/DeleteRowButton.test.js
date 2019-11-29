import React from "react";
import { render } from "tests/utils/rtl";

import { DeleteRowButton } from "./";

describe("DeleteRowButton", () => {
  it("should render", () => {
    expect(render(<DeleteRowButton />).asFragment()).toMatchSnapshot();
  });
});
