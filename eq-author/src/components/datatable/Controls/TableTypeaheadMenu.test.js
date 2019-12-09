import React from "react";
import { render } from "tests/utils/rtl";

import { TableTypeaheadMenu } from "./";

describe("TableTypeaheadMenu", () => {
  let props;

  beforeEach(() => {
    props = {
      getMenuProps: jest.fn(),
      getItemProps: jest.fn(),
      items: [{ value: "Hello" }, { value: "world" }],
    };
  });

  it("should render", () => {
    const { getByText } = render(<TableTypeaheadMenu {...props} />);
    expect(getByText("Hello")).toBeTruthy();
    expect(getByText("world")).toBeTruthy();
  });
});
