import React from "react";
import { render } from "tests/utils/rtl";

import ExternalLink from ".";

const setup = (props) =>
  render(
    <ExternalLink
      url="https://www.google.com/"
      linkText="link to google"
      {...props}
    />
  );

describe("Inline external link render", () => {
  it("should render given url", () => {
    const { getByTestId } = setup();
    const externalLinkHref = getByTestId("external-link-href");
    expect(externalLinkHref.getAttribute("href")).toEqual(
      "https://www.google.com/"
    );
  });

  it("should render given linkText", () => {
    const { getByTestId } = setup();
    const externalLinkText = getByTestId("external-link-text");
    expect(externalLinkText).toHaveTextContent("link to google");
  });

  it("screen reader text should be off screen", () => {
    const { getByTestId } = setup();
    const externalLinkScreenReaderText = getByTestId(
      "external-link-screen-reader-text"
    );
    expect(externalLinkScreenReaderText).toHaveStyleRule("margin", "-1px");
  });
});
