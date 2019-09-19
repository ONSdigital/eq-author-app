import React from "react";

import { render } from "tests/utils/rtl";
import InformationBox from "./";

describe("InformationBox", () => {
  const props = {
    headerText: "header text",
    children: "content text",
  };
  it("should display messages correctly", () => {
    const { getByText } = render(<InformationBox {...props} />);

    const headerText = getByText("header text");
    const contentText = getByText("content text");

    expect(headerText).toBeTruthy();
    expect(contentText).toBeTruthy();
  });
});
