import React from "react";
import { render } from "tests/utils/rtl";
import TextInput from ".";

describe("components/Answers/Dummy/TextInput", () => {
  it("shoulder render", function () {
    const { asFragment } = render(<TextInput />);
    expect(asFragment()).toMatchSnapshot();
  });
});
