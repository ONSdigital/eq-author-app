import React from "react";
import { render } from "tests/utils/rtl";

import ExternalLink from ".";

describe("Inline external link render", () => {
  it("should render as expected", () => {
    const externalLink = render(
      <ExternalLink url="https://www.google.com/" linkText="link to google" />
    );
    expect(externalLink).toMatchSnapshot();
  });
});
