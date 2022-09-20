import React from "react";
import { render } from "tests/utils/rtl";

import ExternalLinkButton from "components/buttons/ExternalLinkButton";

const renderLinkButtonWithIcon = ({
  url = "/test",
  text = "Button Text",
  disabled,
}) =>
  render(
    <ExternalLinkButton
      url={url}
      text={text}
      disabled={disabled}
      dataTest="link-button-with-icon"
    />
  );

describe("LinkButtonWithIcon", () => {
  it("should render", () => {
    const { getByTestId } = renderLinkButtonWithIcon({});

    expect(getByTestId("link-button-with-icon")).toBeInTheDocument();
  });

  it("should render as a disabled button", () => {
    const { getByTestId } = renderLinkButtonWithIcon({ disabled: true });

    expect(
      getByTestId("link-button-with-icon").getAttribute("aria-disabled")
    ).toEqual("true");
  });

  it("should not render as a disabled button", () => {
    const { getByTestId } = renderLinkButtonWithIcon({});

    expect(getByTestId("link-button-with-icon").getAttribute("href")).toEqual(
      "/test"
    );
  });
});
