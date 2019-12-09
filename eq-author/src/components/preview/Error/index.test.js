import React from "react";
import { render } from "tests/utils/rtl";

import Error from ".";

describe("Error", () => {
  it("should render", () => {
    const { asFragment } = render(<Error />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render as large", () => {
    const { asFragment } = render(<Error large />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render as small", () => {
    const { asFragment } = render(<Error small />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render with no margin", () => {
    const { asFragment } = render(<Error margin={false} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
