import React from "react";
import { render } from "tests/utils/rtl";

import AccessDenied from "./";

describe("Access denied page", () => {
  it("should render with access denied message", () => {
    const { getByText } = render(<AccessDenied />);
    expect(getByText("403 — Access Denied")).toBeTruthy();
  });
});
