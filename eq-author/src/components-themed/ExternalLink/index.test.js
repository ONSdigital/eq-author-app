import React from "react";
import { render } from "tests/utils/rtl";

import ExternalLink from ".";

describe("Inline external link render", () => {
  it("should render as expected", () => {
    const { asFragment } = render(
      <ExternalLink url="https://www.google.com/" linkText="link to google" />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
