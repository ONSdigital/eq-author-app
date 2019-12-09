import React from "react";
import { render } from "tests/utils/rtl";

import DialogHeader from "./";

describe("DialogHeader", () => {
  it("should render", () => {
    const { getByText } = render(
      <DialogHeader>Dialog header content</DialogHeader>
    );
    expect(getByText("Dialog header content")).toBeTruthy();
  });
});
